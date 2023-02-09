// pages/roles/[roleId]/edit.tsx
import React from 'react'
import { useQuery } from '@apollo/client'
import toast from 'react-hot-toast'
import { ROLES_QUERY } from '../../api/query/roles/roles-queries'
import { AbsenceType, Role } from '@prisma/client'
import { useRouter } from 'next/router'
import { RoleForm } from '../../../components/role/RoleForm'
import { Vortex } from 'react-loader-spinner'
import { ABSENCE_TYPE_QUERY } from '../../api/query/absenceTypes/absenceTypes-queries'
import { AbsenceTypeForm } from '../../../components/absenceType/AbsenceTypeForm'

const AbsenceTypeEditPage = () => {
  const router = useRouter()
  const absenceTypeId = router.query.absenceTypeId as string

  if (!absenceTypeId) {
    toast.error('Id not informed')
  }

  const { data, loading, error } = useQuery(ABSENCE_TYPE_QUERY, {
    variables: { id: absenceTypeId },
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

  const nodes = data?.absenceTypes.edges.map(({ node }: { node: AbsenceType }) => node)
  const absenceType = nodes.shift()

  return (
    <AbsenceTypeForm 
      absenceType={absenceType}
    />
  )
}

export default AbsenceTypeEditPage
