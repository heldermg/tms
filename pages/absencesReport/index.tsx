import React, { useState } from 'react'
import Head from 'next/head'
import Chart from '../../components/chart/Chart'
import { getNextDays } from '../../lib/time'
import { ChartData } from '../../components/chart/ChartData'
import { ROLES_WITH_ABSENCE_QUERY } from '../api/query/roles/roles-queries'
import { useQuery } from '@apollo/client'
import { Vortex } from 'react-loader-spinner'
import { Role, Team } from '@prisma/client'
import { format } from 'date-fns'
import { randomRgb } from '../../lib/util'
import { TEAMS_QUERY } from '../api/query/teams/teams-queries'

function getNumberOfAbsences(chartLabels: string[], users: any, teamId: string): number[] {
  let count: number
  console.log('teamId')
  console.log(teamId)
  
  const data = chartLabels.map((l) => {
    count = 0
    let usersIdCounted: string[] = []
    users.forEach((u: any) => {
      u.absences.forEach((a: any) => {
        console.log(u.teamId)
        if (u.teamId == teamId) {
          const start = format(new Date(a.startDateAt.slice(0, -1)), 'dd/MM/yyyy')
          const end = format(new Date(a.endDateAt.slice(0, -1)), 'dd/MM/yyyy')
          if ((l == start || l == end) && !usersIdCounted?.includes(u.id)) {
            count++
            usersIdCounted.push(u.id)
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
  const [teamId, setTeamId] = useState("")

  const { data, loading, error } = useQuery(ROLES_WITH_ABSENCE_QUERY, {
    fetchPolicy: 'no-cache',
  })

  const { data: dataTeams, loading: loadingTeams, error: errosTeams } = useQuery(TEAMS_QUERY, {
    fetchPolicy: 'no-cache',
  })

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

  const chartLabels = getNextDays(days)

  const datasets = roles.map((r: any) => {
    return new ChartData(r.acronym, getNumberOfAbsences(chartLabels, r.users, teamId), randomRgb())
  })

  const handleChartDaysChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    event.preventDefault()
    setDays(+event.target.value)
  }

  const handleTeamChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    event.preventDefault()
    setTeamId(event.target.value)
  }

  return (
    <div>
      <Head>
        <title>Absences</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-row">
        <label className="block m-4">
          <span className="text-gray-700">Chart Days</span>
          <select
            className="mt-1 block rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            onChange={handleChartDaysChange}
            defaultValue={7}
          >
            <option key={5} value={5}>5</option>
            <option key={7} value={7}>7</option>
            <option key={10} value={10}>10</option>
            <option key={15} value={15}>15</option>
          </select>
        </label>
        <label className="block m-4">
          <span className="text-gray-700">Team</span>
          <select
            className="mt-1 block rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            onChange={handleTeamChange}
            defaultValue={7}
          >
            {dataTeams?.teams.edges.map(({ node }: { node: Team }) => (
              <option key={node.id} value={node.id}>
                {node.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div>
        <Chart
          title="Absences By Roles"
          labels={chartLabels}
          datasets={datasets}
        />
      </div>
    </div>
  )
}

export default ChartReport
