// pages/roles/[roleId]/index.tsx

import React from 'react'
import { useQuery } from '@apollo/client'
import toast, { Toaster } from 'react-hot-toast'
import Link from 'next/link'
import { ROLES_QUERY } from '../../api/query/roles/roles-queries'
import { Role } from '@prisma/client'
import { useRouter } from 'next/router'

const DetailRolePage = () => {
  const router = useRouter()
  const roleId = router.query.roleId as string

  if (!roleId) {
    toast.error('Id not informed')
  }

  const { data, loading, error, fetchMore } = useQuery(ROLES_QUERY, {
    variables: { id: roleId },
    fetchPolicy: 'no-cache',
  })

  if (loading) return <p>Loading...</p>
  if (error) return <p>Oh no... {error.message}</p>

  const nodes = data?.roles.edges.map(({ node }: { node: Role }) => node)
  const role = nodes.shift()

  return (
    <div className="container mx-auto max-w-md py-12">
      <Toaster />
      <h1 className="text-3xl font-medium my-5">Role {role.name} Detail</h1>
      <div className="grid grid-cols-1 gap-y-6 shadow-lg p-8 rounded-lg">
        <label className="block">
          <span className="text-gray-700">Name</span>
          <input
            placeholder="Name"
            value={role.name}
            disabled
            name="name"
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </label>
        <label className="block">
          <span className="text-gray-700">Acronym</span>
          <input
            placeholder="Acronym"
            value={role.acronym}
            disabled
            name="acronym"
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </label>
        <label className="block">
          <span className="text-gray-700">Description</span>
          <input
            placeholder="Description"
            value={role.description}
            disabled
            name="description"
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </label>

        <div className="capitalize font-medium py-2 px-4 rounded-md">
          <Link href={`/roles/`}>
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

export default DetailRolePage
