// pages/roles/[roleId]/index.tsx

import React from 'react'
import { useQuery } from '@apollo/client'
import toast from 'react-hot-toast'
import { ROLES_QUERY } from '../../api/query/roles/roles-queries'
import { Role } from '@prisma/client'
import { useRouter } from 'next/router'
import { RoleDetail } from '../../../components/role/RoleDetail'

const DetailRolePage = () => {
  const router = useRouter()
  const roleId = router.query.roleId as string

  if (!roleId) {
    toast.error('Id not informed')
  }

  const { data, loading, error } = useQuery(ROLES_QUERY, {
    variables: { id: roleId },
    fetchPolicy: 'no-cache',
  })

  if (loading) return <p>Loading...</p>
  if (error) return <p>Oh no... {error.message}</p>

  const nodes = data?.roles.edges.map(({ node }: { node: Role }) => node)
  const role = nodes.shift()

  return (
    <RoleDetail role={role} />
  )
}

export default DetailRolePage
