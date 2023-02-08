import { useMutation, useQuery } from '@apollo/client'
import { getOperationName } from '@apollo/client/utilities'
import { Team, User } from '@prisma/client'
import Link from 'next/link'
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast, Toaster } from 'react-hot-toast'
import { TEAMS_CREATE_MUTATION, TEAMS_QUERY, TEAMS_UPDATE_MUTATION } from '../../pages/api/query/teams/teams-queries'
import { USERS_QUERY } from '../../pages/api/query/users/users-queries'
import { FormType } from '../form-util'
import SvgIcon from '../icons/SvgIcon'

type FormValues = {
  name: string
  managerId: string
  users?: string[]
}

interface TeamFormProps {
  team?: Team
  users?: string[]
}

export const TeamForm = ({ team, users }: TeamFormProps) => {
  const { id, name, managerId } = team || {}

  const isEdit = id ? true : false
  let formType: FormType = id ? FormType.EDIT : FormType.NEW

  const buttonLabel = isEdit ? "Update Team" : "Create new Team"
  const loadingButtonLabel = isEdit ? "Updating..." : "Creating..."

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormValues>({
    defaultValues: {
      name,
      managerId,
      users: users ? users : undefined,
    }
  })

  const [updateTeam, { loading: loadingUpdate, error: errorUpdate }] = useMutation(TEAMS_UPDATE_MUTATION, {
    refetchQueries: [{ query: TEAMS_QUERY }, getOperationName(TEAMS_QUERY)!]
  })

  const [createTeam, { loading: loadingCreate, error:errorCreate }] = useMutation(TEAMS_CREATE_MUTATION, {
    onCompleted: () => reset(),
    refetchQueries: [{ query: USERS_QUERY }, getOperationName(USERS_QUERY)!]
  })

  const {
    data: usersData,
    loading: usersLoading,
    error: usersError,
  } = useQuery(USERS_QUERY, {
    variables: { 
      withoutTeam: true, 
      id: id ? id : undefined 
    },
    fetchPolicy: 'no-cache',
  })

  if (usersError) return <p>Oh no... {usersError.message}</p>

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const { name, managerId, users } = data
    const variables = { id: (isEdit ? id : null), name, managerId, users }

    try {
      if (isEdit) {
        await toast.promise(updateTeam({ variables }), {
          loading: 'Updating the Team..',
          success: 'Team successfully updated!🎉',
          error: (err) => `Something went wrong 😥\nMessage:\n ${err?.message}`,
        })
      } else {
        await toast.promise(createTeam({ variables }), {
          loading: 'Creating new Team..',
          success: 'Team successfully created!🎉',
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
      <h1 className="text-3xl font-medium my-5 text-center">{formType} Team</h1>
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
            maxLength={30}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </label>
        <label className="block">
          <span className="text-gray-700">Manager</span>
          {usersLoading ? (
            <span>Loandig users</span>
          ) : (
            <select
              required={true}
              placeholder="Manager"
              {...register('managerId', { required: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              {usersData?.users.edges.map(({ node }: { node: User }) => (
                <option key={node.id} value={node.id}>
                  {node.name} - {node.email}
                </option>
              ))}
            </select>
          )}
        </label>
        <label className="block">
          <span className="text-gray-700">Members</span>
          {usersLoading ? (
            <span>Loandig users</span>
          ) : (
            <span>
            {usersData?.users?.edges.map(({ node }: { node: User }) => (
              <div key={node.id} className='text-gray-700'>
                <label>
                  <input
                    type="checkbox"
                    placeholder="Users"
                    value={node.id}
                    {...register('users', { required: false })}
                  />
                  <span>&nbsp;{node.name} - {node.email}</span>
                </label>
              </div>
            ))}
            </span>
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
                iconType='animate-spin'
                className='w-6 h-6 animate-spin mr-1'
                title='Animate Spin'
                desc='Animate Spin Updating'
              />
              <span>{loadingButtonLabel}</span>
            </span>
          ) : (
            <span>{buttonLabel}</span>
          )}
        </button>
        <Link href={`/teams/`}>
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
