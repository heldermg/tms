// pages/absences/[absenceId]/index.tsx
import React from 'react'
import { useQuery } from '@apollo/client'
import toast from 'react-hot-toast'
import { Absence, AbsenceType, User } from '@prisma/client'
import { USERS_QUERY } from '../../api/query/users/users-queries'
import { useRouter } from 'next/router'
import { Vortex } from 'react-loader-spinner'
import { ABSENCE_QUERY } from '../../api/query/absences/absences-queries'
import { AbsenceDetail } from '../../../components/absence/AbsenceDetail'
import { ABSENCE_TYPE_QUERY } from '../../api/query/absenceTypes/absenceTypes-queries'

const DetailTeamPage = () => {
  const router = useRouter()
  const absenceId = router.query.absenceId as string

  if (!absenceId) {
    toast.error('Id not informed')
  }

  const {
    data,
    loading: absenceLoading,
    error,
  } = useQuery(ABSENCE_QUERY, {
    variables: { id: absenceId },
    fetchPolicy: 'no-cache',
  })

  const nodes = data?.absences.edges.map(({ node }: { node: Absence }) => node)
  const absence = nodes?.shift()

  const userId = absence?.userId
  const absenceTypeId = absence?.absenceTypeId

  const {
    data: userData,
    loading: userLoading,
    error: usersError,
  } = useQuery(USERS_QUERY, {
    skip: !userId,
    variables: { id: userId },
    fetchPolicy: 'no-cache',
  })

  const {
    data: absenceTypeData,
    loading: absenceTypeLoading,
    error: absenceTypeError,
  } = useQuery(ABSENCE_TYPE_QUERY, {
    skip: !absenceTypeId,
    variables: { id: absenceTypeId },
    fetchPolicy: 'no-cache',
  })

  if (absenceLoading)
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
  if (usersError) return <p>Oh no... {usersError.message}</p>
  if (absenceTypeError) return <p>Oh no... {absenceTypeError.message}</p>

  const userNodes = userData?.users.edges.map(
    ({ node }: { node: User }) => node
  )
  const user = userNodes?.shift()

  const absenceTypeNodes = absenceTypeData?.absenceTypes.edges.map(
    ({ node }: { node: AbsenceType }) => node
  )
  const absenceType = absenceTypeNodes?.shift()

  return (
    <AbsenceDetail
      absence={absence}
      user={user}
      userLoading={userLoading}
      absenceLoading={absenceLoading}
      absenceType={absenceType}
      absenceTypeLoading={absenceTypeLoading}
    />
  )
}

export default DetailTeamPage
