// pages/teams/[teamId]/edit.tsx
import React from 'react'
import { useQuery } from '@apollo/client'
import toast from 'react-hot-toast'
import { Team } from '@prisma/client'
import { useRouter } from 'next/router'
import { TEAMS_QUERY } from '../../api/query/teams/teams-queries'
import { TeamForm } from '../../../components/team/TeamForm'

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

  if (loading) return <p>Loading...</p>
  if (error) return <p>Oh no... {error.message}</p>

  const nodes = data?.teams.edges.map(({ node }: { node: Team }) => node)
  const team = nodes.shift()

  console.log(team);
  

  return (
    <TeamForm team={team} />
  )
}

export default EditTeamPage
