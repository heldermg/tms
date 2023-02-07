// pages/roles/[roleId]/edit.tsx
import React from 'react'
import { useQuery } from '@apollo/client'
import toast from 'react-hot-toast'
import { ROLES_QUERY } from '../../api/query/roles/roles-queries'
import { Role } from '@prisma/client'
import { useRouter } from 'next/router'
import { RoleForm } from '../../../components/role/RoleForm'
import { Vortex } from 'react-loader-spinner'

const EditRolePage = () => {
  const router = useRouter()
  const roleId = router.query.roleId as string

  if (!roleId) {
    toast.error('Id not informed')
  }

  const { data, loading, error } = useQuery(ROLES_QUERY, {
    variables: { id: roleId },
    fetchPolicy: 'no-cache',
  })

  if (loading) return (
    <div className="flex flex-col justify-center items-center">
      <Vortex
        visible={true}
        height="80"
        width="80"
        ariaLabel="vortex-loading"
        wrapperStyle={{}}
        wrapperClass="vortex-wrapper"
        colors={['#1D4ED8', 'gray', '#1D4ED8', 'gray', '#1D4ED8', 'gray']}
      />
    </div>
  )
  if (error) return <p>Oh no... {error.message}</p>

  const nodes = data?.roles.edges.map(({ node }: { node: Role }) => node)
  const role = nodes.shift()

  return (
    <RoleForm role={role} />
  )
}

export default EditRolePage
