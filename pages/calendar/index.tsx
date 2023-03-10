import { useEffect, useMemo, useState } from 'react'
import { useLazyQuery, useQuery } from '@apollo/client'
import { ABSENCES_BY_TEAM_QUERY } from '../api/query/absences/absences-queries'
import { Vortex } from 'react-loader-spinner'
import { Absence, Team } from '@prisma/client'
import Head from 'next/head'
import { TEAMS_QUERY } from '../api/query/teams/teams-queries'
import Calendar from '../../components/calendar/Calendar'



export default function CustomCalendar() {
  const [teamId, setTeamId] = useState('')

  const {
    data: dataTeams,
    loading: loadingTeams,
    error: errosTeams,
  } = useQuery(TEAMS_QUERY, {
    fetchPolicy: 'no-cache',
  })

  const [ 
    getAbsencesByTeam, 
    { data: dataAbsences, loading: loadingAbsences, error: errorAbsences }
  ] = useLazyQuery(ABSENCES_BY_TEAM_QUERY, {
    fetchPolicy: 'no-cache',
    variables: {
      teamId
    }
  })

  useEffect(() => {
    const teams = dataTeams?.teams.edges.map(({ node }: { node: Team }) => node)
    const firstTeamId = teams ? teams[0]?.id : null
    if (firstTeamId) {
      setTeamId(firstTeamId)
      getAbsencesByTeam()
    }
  }, [dataTeams])

  if (loadingAbsences || loadingTeams)
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
  if (errorAbsences) return <p>Oh no... {errorAbsences.message}</p>
  if (errosTeams) return <p>Oh no... {errosTeams.message}</p>

  const absences = dataAbsences?.absencesByTeam.edges.map(
    ({ node }: { node: Absence }) => node
  )

  const teams = dataTeams.teams.edges.map(({ node }: { node: Team }) => node)

  const handleTeamChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    event.preventDefault()
    setTeamId(event.target.value)
    getAbsencesByTeam()
  }

  return (
    <div>
      <Head>
        <title>Calendar</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className='flex flex-row'>
        <label className="text-blue-400 text-2xl block ml-4">
          Filters
        </label>
      </div>
      <div className="flex flex-row">
        <label className="block ml-4">
          <span className="text-gray-700">Team</span>
          <select
            className="mt-1 block rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            onChange={handleTeamChange}
            value={teamId}
          >
            {teams?.map((t: any) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <Calendar
        absences={absences}
      />
    </div>
  )
}
