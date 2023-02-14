import { useMutation, useQuery } from '@apollo/client'
import { getOperationName } from '@apollo/client/utilities'
import { Profile, Role, User } from '@prisma/client'
import Link from 'next/link'
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast, Toaster } from 'react-hot-toast'
import { ROLES_QUERY } from '../../pages/api/query/roles/roles-queries'
import {
  USERS_CREATE_MUTATION,
  USERS_UPDATE_MUTATION,
} from '../../pages/api/query/users/users-queries'
import { FormType } from '../form-util'
import SvgIcon from '../icons/SvgIcon'
import { UserProfile } from './UserProfile'

type FormValues = {
  name: string
  email: string
  profile: Profile
  image?: string
  roles?: string[]
}

interface UserFormProps {
  user?: User
  roles?: string[]
}

export const UserForm = ({ user, roles }: UserFormProps) => {
  const { id, name, email, profile, image } = user || {}

  const isEdit = id ? true : false
  const formType: FormType = id ? FormType.EDIT : FormType.NEW

  const buttonLabel = isEdit ? 'Update User' : 'Create new User'
  const loadingButtonLabel = isEdit ? 'Updating...' : 'Creating...'

  const { register, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: {
      name,
      email,
      profile,
      image: image ? image : undefined,
      roles: roles ? roles : undefined,
    },
  })

  const [createUser, { loading: loadingCreate }] = useMutation(
    USERS_CREATE_MUTATION,
    {
      onCompleted: () => reset(),
      refetchQueries: [getOperationName(ROLES_QUERY)!],
    }
  )

  const [updateUser, { loading: loadingUpdate }] = useMutation(
    USERS_UPDATE_MUTATION,
    {
      refetchQueries: [getOperationName(ROLES_QUERY)!],
    }
  )

  const {
    data: rolesData,
    loading: rolesLoading,
    error: rolesError,
  } = useQuery(ROLES_QUERY, {
    fetchPolicy: 'no-cache',
  })

  if (rolesError) return <p>Oh no... {rolesError.message}</p>

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const { name, email, profile, image, roles } = data
    const variables = {
      id: isEdit ? id : null,
      name,
      email,
      profile,
      image,
      roles,
    }

    try {
      if (isEdit) {
        await toast.promise(updateUser({ variables }), {
          loading: 'Updating the User..',
          success: 'User successfully updated!🎉',
          error: (err) => `Something went wrong 😥\nMessage:\n ${err?.message}`,
        })
      } else {
        await toast.promise(createUser({ variables }), {
          loading: 'Creating new User..',
          success: 'User successfully created!🎉',
          error: (err) => `Something went wrong 😥\nMessage:\n ${err?.message}`,
        })
      }
    } catch (error: any) {
      console.error(error?.message)
    }
  }

  return (
    <div className="container mx-auto max-w-md py-12">
      <Toaster />
      <h1 className="text-3xl font-medium my-5 text-center">{formType} User</h1>
      <form
        className="grid grid-cols-1 gap-y-6 shadow-lg p-8 rounded-lg"
        onSubmit={handleSubmit(onSubmit)}
      >
        <label className="block">
          <span className="text-gray-700">Name</span>
          <input
            placeholder="Name"
            {...register('name', { required: true })}
            type="text"
            maxLength={100}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </label>
        <label className="block">
          <span className="text-gray-700">Email</span>
          <input
            placeholder="Email"
            {...register('email', { required: true })}
            type="email"
            maxLength={50}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </label>
        <label className="block">
          <span className="text-gray-700">Profile</span>
          <select
            required={true}
            placeholder="Profile"
            {...register('profile', { required: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            {Object.keys(UserProfile).map((p) => (
              <option key={p} value={p}>
                {UserProfile[p as keyof typeof UserProfile]}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-gray-700">Roles</span>
          {rolesLoading ? (
            <div>Loandig roles</div>
          ) : (
            <>
              {rolesData?.roles?.edges.map(({ node }: { node: Role }) => (
                <div key={node.id} className="text-gray-700">
                  <label>
                    <input
                      type="checkbox"
                      placeholder="Roles"
                      value={node.id}
                      {...register('roles', { required: true })}
                    />
                    <span>
                      &nbsp;{node.acronym} - {node.name}
                    </span>
                  </label>
                </div>
              ))}
            </>
          )}
        </label>

        <button
          disabled={loadingCreate || loadingUpdate}
          type="submit"
          className="capitalize bg-blue-500 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-600"
        >
          {loadingCreate || loadingUpdate ? (
            <span className="flex items-center justify-center">
              <SvgIcon
                iconType="animate-spin"
                className="w-6 h-6 animate-spin mr-1"
                title="Animate Spin"
                desc="Animate Spin Updating"
              />
              <span>{loadingButtonLabel}</span>
            </span>
          ) : (
            <span>{buttonLabel}</span>
          )}
        </button>
        <Link href={`/users/`}>
          <a className="w-full">
            <button
              type="button"
              className="w-full capitalize bg-gray-500 text-white font-medium py-2 px-4 rounded-md hover:bg-gray-600"
            >
              Voltar
            </button>
          </a>
        </Link>
      </form>
    </div>
  )
}
