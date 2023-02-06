import { useMutation } from '@apollo/client'
import { getOperationName } from '@apollo/client/utilities'
import { User } from '@prisma/client'
import Link from 'next/link'
import React from 'react'
import { toast, Toaster } from 'react-hot-toast'
import {
  USERS_DELETE_MUTATION,
  USERS_QUERY,
} from '../../pages/api/query/users/users-queries'
import SvgIcon from '../icons/SvgIcon'
import { UserProfile } from './UserProfile'

export const UserList = ({ users }: any) => {

  const [deleteUser, { loading, error }] = useMutation(USERS_DELETE_MUTATION, {
    refetchQueries: [{ query: USERS_QUERY }, getOperationName(USERS_QUERY)!],
  })

  async function handleDeleteUser(id: string) {
    const variables = { id }
    try {
      await toast.promise(deleteUser({ variables }), {
        loading: 'Deleting the User..',
        success: 'User successfully deleted!🎉',
        error: `Something went wrong 😥 Please try again -  ${error}`,
      })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="flex flex-col justify-center items-center">
      <Toaster />
      <table className="shadow-lg bg-white table-auto">
        <caption className="px-6 py-3 font-bold text-2xl bg-gray-200">
          User List
        </caption>
        <thead>
          <tr>
            <th scope="col" className="bg-blue-50 border text-left px-8 py-4">
              Name
            </th>
            <th scope="col" className="bg-blue-50 border text-left px-8 py-4">
              Email
            </th>
            <th scope="col" className="bg-blue-50 border text-left px-8 py-4">
              Profile
            </th>
            <th scope="col" className="bg-blue-50 border text-left px-8 py-4">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {users.edges.map(({ node }: { node: User }) => (
            <tr key={node.id}>
              <td className="px-6 py-4">{node.name}</td>
              <td className="px-6 py-4 text-left">{node.email}</td>
              <td className="px-6 py-4 text-left">{UserProfile[node.profile]}</td>
              <td className="px-6 py-4">
                <Link href={`/users/${node.id}`}>
                  <a className="inline-flex items-center border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0">
                    <SvgIcon
                      iconType="magnifying-glass-plus"
                      title="Detail"
                      desc="Detail Button"
                      className="w-6 h-6"
                    />
                  </a>
                </Link>
                <Link href={`/users/${node.id}/edit`}>
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
                  onClick={() => { if (window.confirm(`Are you sure you want to delete the user ${node.name} ?`)) handleDeleteUser(node.id) } }
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
                <Link href={`/users/new`}>
                  <a className="inline-flex items-center border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                      Add New User
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
