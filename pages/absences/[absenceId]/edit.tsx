// pages/absences/[absenceId]/edit.tsx
import React from 'react'
import { useQuery } from '@apollo/client'
import toast from 'react-hot-toast'
import { Absence } from '@prisma/client'
import { useRouter } from 'next/router'
import { Vortex } from 'react-loader-spinner'
import { ABSENCE_QUERY } from '../../api/query/absences/absences-queries'
import { AbsenceForm } from '../../../components/absence/AbsenceForm'

const AbsenceEditPage = () => {
  const router = useRouter()
  const absenceId = router.query.absenceId as string

  if (!absenceId) {
    toast.error('Id not informed')
  }

  const { data, loading, error } = useQuery(ABSENCE_QUERY, {
    variables: { id: absenceId },
    fetchPolicy: 'no-cache',
  })

  if (loading)
    return (
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

  const nodes = data?.absences.edges.map(({ node }: { node: Absence }) => node)
  const absence = nodes.shift()

  return <AbsenceForm absence={absence} />
}

export default AbsenceEditPage
