// pages/roles/[roleId]/index.tsx

import React from 'react'
import { useQuery } from '@apollo/client'
import toast from 'react-hot-toast'
import { AbsenceType } from '@prisma/client'
import { useRouter } from 'next/router'
import { Vortex } from 'react-loader-spinner'
import { ABSENCE_TYPE_QUERY } from '../../api/query/absenceTypes/absenceTypes-queries'
import { AbsenceTypeDetail } from '../../../components/absenceType/AbsenceTypeDetail'

const AbsenceTypeDetailPage = () => {
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
    <AbsenceTypeDetail absenceType={absenceType} />
  )
}

export default AbsenceTypeDetailPage
