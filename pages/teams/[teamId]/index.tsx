// pages/roles/new.tsx
import React from 'react'
import { useQuery } from '@apollo/client'
import toast, { Toaster } from 'react-hot-toast'
import Link from 'next/link'
import { Team, User } from '@prisma/client'
import { USERS_QUERY } from '../../api/query/users/users-queries'
import { useRouter } from 'next/router'
import { TEAMS_QUERY } from '../../api/query/teams/teams-queries'

const DetailTeamPage = () => {
  const router = useRouter()
  const teamId = router.query.teamId as string

  if (!teamId) {
    toast.error('Id not informed')
  }

  const { data, loading, error, fetchMore } = useQuery(TEAMS_QUERY, {
    variables: { id: teamId },
    fetchPolicy: 'no-cache',
  })

  const nodes = data?.teams.edges.map(({ node }: { node: Team }) => node)
  const team = nodes?.shift()

  const managerId = team?.managerId

  const {
    data: usersData,
    loading: usersLoading,
    error: usersError,
    fetchMore: usersFetchMore,
  } = useQuery(USERS_QUERY, {
    skip: !managerId,
    variables: { id: managerId },
    fetchPolicy: 'no-cache',
  })

  if (loading) return <p>Loading...</p>
  if (error) return <p>Oh no... {error.message}</p>
  if (usersError) return <p>Oh no... {usersError.message}</p>

  return (
    <div className="container mx-auto max-w-md py-12">
      <Toaster />
      <h1 className="text-3xl font-medium my-5">Team {team.name} Detail</h1>
      <div className="grid grid-cols-1 gap-y-6 shadow-lg p-8 rounded-lg">
        <label className="block">
          <span className="text-gray-700">Name</span>
          <input
            placeholder="Name"
            value={team.name}
            disabled
            name="name"
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </label>
        <label className="block">
          <span className="text-gray-700">Manager</span>
          {usersLoading ? (
            <span>Loandig user</span>
          ) : (
            <select
              required={false}
              value={team.managerId}
              disabled
              placeholder="Manager"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              {usersData?.users.edges.map(({ node }: { node: User }) => (
                <option key={node.id} value={node.id} selected>
                  {node.name}
                </option>
              ))}
            </select>
          )}
        </label>

        <div className="capitalize font-medium py-2 px-4 rounded-md">
          <Link href={`/teams/`}>
            <a className="w-full">
              <button
                disabled={loading}
                type="button"
                className="w-full capitalize bg-gray-500 text-white font-medium py-2 px-4 rounded-md hover:bg-gray-600"
              >
                Voltar
              </button>
            </a>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default DetailTeamPage
