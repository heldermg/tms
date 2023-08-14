import React, { useMemo, useState } from 'react'
import Head from 'next/head'
import BarChart from '../../components/chart/BarChart'
import { getNextDays } from '../../lib/time'
import { ChartData } from '../../components/chart/ChartData'
import { ROLES_COUNT_BY_TEAM, ROLES_WITH_ABSENCE_QUERY } from '../api/query/roles/roles-queries'
import { useLazyQuery, useQuery } from '@apollo/client'
import { Vortex } from 'react-loader-spinner'
import { Role, Team } from '@prisma/client'
import { format } from 'date-fns'
import { randomRgb } from '../../lib/util'
import { TEAMS_MEMBERS_COUNT_QUERY } from '../api/query/teams/teams-queries'

function getNumberOfAbsences(
  chartLabels: string[],
  users: any,
  teamId: string
): number[] {
  let count: number

  const data = chartLabels.map((label) => {
    count = 0
    let usersIdCounted: string[] = []

    users.forEach((user: any) => {
      user.absences.forEach((absence: any) => {
        if (user.teamId == teamId) {
          const start = format(
            new Date(absence.startDateAt.slice(0, -1)),
            'dd/MM/yyyy'
          )
          const end = format(
            new Date(absence.endDateAt.slice(0, -1)),
            'dd/MM/yyyy'
          )

          if (
            (label == start || label == end) &&
            !usersIdCounted?.includes(user.id)
          ) {
            count++
            usersIdCounted.push(user.id)
          }
        }
      })
    })
    return count
  })

  return data
}

function ChartReport() {
  const [days, setDays] = useState(7)
  const [teamId, setTeamId] = useState('')
  const [teamMembers, setTeamMembers] = useState(0)

  const { data, loading, error } = useQuery(ROLES_WITH_ABSENCE_QUERY, {
    fetchPolicy: 'no-cache',
  })

  const [ 
    getRolesByTeamId, 
    { data: dataRoles, loading: loadingRoles, error: errorRoles }
  ] = useLazyQuery(ROLES_COUNT_BY_TEAM, {
    fetchPolicy: 'no-cache',
    variables: {
      teamId
    }
  })

  const {
    data: dataTeams,
    loading: loadingTeams,
    error: errosTeams,
  } = useQuery(TEAMS_MEMBERS_COUNT_QUERY, {
    fetchPolicy: 'no-cache',
  })

  useMemo(() => {
    const teams = dataTeams?.teams.edges.map(({ node }: { node: Team }) => node)
    if (teams && teams.length > 0) {
      console.log(teams);
      
      setTeamMembers(teams[0].membersCount)
      setTeamId(teams[0].id)
      getRolesByTeamId()
    }
  }, [dataTeams])

  if (loading || loadingTeams)
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
  if (errosTeams) return <p>Oh no... {errosTeams.message}</p>

  const roles = data.rolesWithAbsences.edges.map(
    ({ node }: { node: Role }) => node
  )

  const teams = dataTeams.teams.edges.map(({ node }: { node: Team }) => node)

  const chartLabels = getNextDays(days)

  const datasets = roles.map((r: any) => {
    return new ChartData(
      r.acronym,
      getNumberOfAbsences(chartLabels, r.users, teamId),
      randomRgb()
    )
  })

  const handleChartDaysChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    event.preventDefault()
    setDays(+event.target.value)
  }

  const handleTeamChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    event.preventDefault()
    const value = event.target.value
    const valueSplitted = value.split('/')
    setTeamId(valueSplitted[0])
    setTeamMembers(+valueSplitted[1])
    getRolesByTeamId()
  }

  return (
    <div>
      <Head>
        <title>Absences</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className='flex flex-row'>
        <label className="text-blue-400 text-2xl block ml-4">
          Filters
        </label>
      </div>
      <div className="flex flex-row">
        <label className="block ml-4">
          <span className="text-gray-700">Chart Days</span>
          <select
            className="mt-1 block rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            onChange={handleChartDaysChange}
            defaultValue={7}
          >
            <option key={5} value={5}>
              5
            </option>
            <option key={7} value={7}>
              7
            </option>
            <option key={10} value={10}>
              10
            </option>
            <option key={15} value={15}>
              15
            </option>
          </select>
        </label>
        <label className="block ml-4">
          <span className="text-gray-700">Team</span>
          <select
            className="mt-1 block rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            onChange={handleTeamChange}
          >
            {teams?.map((t: any) => (
              <option key={t.id} value={`${t.id}/${t.membersCount}`}>
                {t.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className='flex flex-row mt-4'>
        <label className="text-blue-400 text-2xl block ml-4">
          Team Info
        </label>
      </div>
      <div className="flex flex-row">
        <label className="block ml-4">
          <span className="text-gray-700">Total Members</span>
          <input
            placeholder="Title"
            value={teamMembers}
            disabled
            name="Total Team Members"
            type="text"
            className="mt-1 w-1/3 bg-gray-200 block rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </label>
        {loadingRoles ? (
          <span>Loading...</span>
        ) : (
          dataRoles?.countRolesByTeam.edges.map(({ node }: { node: Role }) => (
            <label className="block ml-4" key={node.id}>
              <span className="text-gray-700">{node.acronym}</span>
              <input
                value={node.name}
                disabled
                type="text"
                size={3}
                className="mt-1 bg-gray-200 block rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </label>
          ))
        )}
      </div>
      <div>
        <BarChart
          title="Absences By Roles"
          labels={chartLabels}
          datasets={datasets}
        />
      </div>
    </div>
  )
}

export default ChartReport
