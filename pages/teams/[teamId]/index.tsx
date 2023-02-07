// pages/roles/new.tsx
import React from 'react'
import { useQuery } from '@apollo/client'
import toast from 'react-hot-toast'
import { Team, User } from '@prisma/client'
import { USERS_QUERY } from '../../api/query/users/users-queries'
import { useRouter } from 'next/router'
import { TEAMS_QUERY } from '../../api/query/teams/teams-queries'
import { TeamDetail } from '../../../components/team/TeamDetail'
import { Vortex } from 'react-loader-spinner'

const DetailTeamPage = () => {
  const router = useRouter()
  const teamId = router.query.teamId as string

  if (!teamId) {
    toast.error('Id not informed')
  }

  const { data, loading: teamLoading, error } = useQuery(TEAMS_QUERY, {
    variables: { id: teamId },
    fetchPolicy: 'no-cache',
  })

  const nodes = data?.teams.edges.map(({ node }: { node: Team }) => node)
  const team = nodes?.shift()

  const managerId = team?.managerId

  const {
    data: usersData,
    loading: managerLoading,
    error: usersError,
  } = useQuery(USERS_QUERY, {
    skip: !managerId,
    variables: { id: managerId },
    fetchPolicy: 'no-cache',
  })

  if (teamLoading) return (
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

  const managerNodes = usersData?.users.edges.map(({ node }: { node: User }) => node)
  const manager = managerNodes?.shift()

  return (
    <TeamDetail 
      team={team} 
      teamLoading={teamLoading} 
      manager={manager} 
      managerLoading={managerLoading} />
  )
}

export default DetailTeamPage
