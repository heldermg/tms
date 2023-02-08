// pages/teams/[teamId]/edit.tsx
import React from 'react'
import { useQuery } from '@apollo/client'
import toast from 'react-hot-toast'
import { Team, User } from '@prisma/client'
import { useRouter } from 'next/router'
import { TEAMS_QUERY } from '../../api/query/teams/teams-queries'
import { TeamForm } from '../../../components/team/TeamForm'
import { Vortex } from 'react-loader-spinner'

const EditTeamPage = () => {
  const router = useRouter()
  const teamId = router.query.teamId as string

  if (!teamId) {
    toast.error('Id not informed')
  }

  const { data, loading, error } = useQuery(TEAMS_QUERY, {
    variables: { id: teamId },
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

  const nodes = data?.teams.edges.map(({ node }: { node: Team }) => node)
  const team = nodes.shift()

  const users = team.members.map((t: User) => t.id)

  return (
    <TeamForm 
      team={team}
      users={users}
    />
  )
}

export default EditTeamPage
