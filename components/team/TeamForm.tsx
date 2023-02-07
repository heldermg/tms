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
}

interface TeamFormProps {
  team?: Team
}

export const TeamForm = ({ team }: TeamFormProps) => {
  const { id, name, managerId } = team || {}

  const isEdit = id ? true : false

  let formType: FormType
  if (id) {
    formType = FormType.EDIT

  } else {
    formType = FormType.NEW
  }

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
      managerId
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
    variables: { withoutTeam: true },
    fetchPolicy: 'no-cache',
  })

  if (usersError) return <p>Oh no... {usersError.message}</p>

  const {
    data: managerData,
    loading: managerLoading,
    error: managerError,
  } = useQuery(USERS_QUERY, {
    skip: !managerId,
    variables: { id: managerId },
    fetchPolicy: 'no-cache',
  })

  if (managerError) return <p>Oh no... {managerError.message}</p>

  const managerNodes = managerData?.users.edges.map(({ node }: { node: User }) => node)
  const manager = managerNodes?.shift()

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const { name, managerId } = data
    const variables = { id: (isEdit ? id : null), name, managerId }
    try {
      if (isEdit) {
        await toast.promise(updateTeam({ variables }), {
          loading: 'Updating the Team..',
          success: 'Team successfully updated!🎉',
          error: `Something went wrong 😥 Please try again -  ${errorUpdate?.message}`,
        })
      } else {
        await toast.promise(createTeam({ variables }), {
          loading: 'Creating new Team..',
          success: 'Team successfully created!🎉',
          error: `Something went wrong 😥 Please try again -  ${errorCreate?.message}`,
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
          {usersLoading || managerLoading ? (
            <span>Loandig users</span>
          ) : (
            <select
              required={false}
              placeholder="Manager"
              {...register('managerId', { required: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              {manager &&
                <option key={manager.id} value={manager.id}>
                  {manager.name}
                </option>
              }
              {usersData?.users.edges.map(({ node }: { node: User }) => (
                <option key={node.id} value={node.id}>
                  {node.name}
                </option>
              ))}
            </select>
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
