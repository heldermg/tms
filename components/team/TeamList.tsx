import { useMutation } from '@apollo/client'
import { getOperationName } from '@apollo/client/utilities'
import { Team, User } from '@prisma/client'
import Link from 'next/link'
import React from 'react'
import { toast, Toaster } from 'react-hot-toast'
import {
  TEAMS_DELETE_MUTATION,
  TEAMS_QUERY,
} from '../../pages/api/query/teams/teams-queries'
import SvgIcon from '../icons/SvgIcon'

export const TeamList = ({ teams }: any) => {
  const [deleteTeam, { loading, error }] = useMutation(TEAMS_DELETE_MUTATION, {
    refetchQueries: [{ query: TEAMS_QUERY }, getOperationName(TEAMS_QUERY)!],
  })

  async function handleDeleteTeam(id: string) {
    const variables = { id }
    try {
      await toast.promise(deleteTeam({ variables }), {
        loading: 'Deleting the Team..',
        success: 'Team successfully deleted!🎉',
        error: `Something went wrong 😥 Please try again -  ${error?.message}`,
      })
    } catch (error: any) {
      console.error(error?.message)
    }
  }

  return (
    <div className="flex flex-col justify-center items-center">
      <Toaster />
      <table className="shadow-lg bg-white table-auto">
        <caption className="px-6 py-3 font-bold text-2xl bg-gray-200">
          Team List
        </caption>
        <thead>
          <tr>
            <th scope="col" className="bg-blue-50 border text-left px-8 py-4">
              Name
            </th>
            <th scope="col" className="bg-blue-50 border text-left px-8 py-4">
              Total Members
            </th>
            <th scope="col" className="bg-blue-50 border text-left px-8 py-4">
              Manager
            </th>
            <th scope="col" className="bg-blue-50 border text-left px-8 py-4">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {teams.edges.map(({ node }: { node: any }) => (
            <tr key={node.id}>
              <td className="px-6 py-4">{node.name}</td>
              <td className="px-6 py-4 text-center">{node.members.length}</td>
              <td className="px-6 py-4 text-left">
                {node.members
                  .filter((m: User) => (m.id == node.managerId))
                  .map((m: User) => m.name)}
              </td>
              <td className="px-6 py-4">
                <Link href={`/teams/${node.id}`}>
                  <a className="inline-flex items-center border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0">
                    <SvgIcon
                      iconType="magnifying-glass-plus"
                      title="Detail"
                      desc="Detail Button"
                      className="w-6 h-6"
                    />
                  </a>
                </Link>
                <Link href={`/teams/${node.id}/edit`}>
                  <a className="inline-flex items-center border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0">
                    <SvgIcon
                      iconType="pencil-square"
                      title="Edit"
                      desc="Edit Button"
                      className="w-6 h-6"
                    />
                  </a>
                </Link>
                <button
                  disabled={loading}
                  onClick={() => { if (window.confirm(`Are you sure you want to delete the team ${node.name} ?`)) handleDeleteTeam(node.id) } }
                  className="inline-flex items-center border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0"
                >
                  <SvgIcon
                    iconType="trash"
                    title="Delete"
                    desc="Delete Button"
                    className="w-6 h-6"
                  />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={4}>
              <div className="flex flex-row justify-end">
                <Link href={`/teams/new`}>
                  <a className="inline-flex items-center border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                      Add New Team
                    </button>
                  </a>
                </Link>
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
