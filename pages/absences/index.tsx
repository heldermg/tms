// /pages/index.tsx
import Head from 'next/head'
import { useQuery } from '@apollo/client'
import { ABSENCE_QUERY } from '../api/query/absences/absences-queries'
import { Vortex } from 'react-loader-spinner'
import { AbsenceList } from '../../components/absence/AbsenceList'

function AbsenceListPage() {
  const { data, loading, error, fetchMore } = useQuery(ABSENCE_QUERY, {
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

  //const { endCursor, hasNextPage } = data.roles.pageInfo

  return (
    <div>
      <Head>
        <title>Absences</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AbsenceList absences={data?.absences} />
    </div>
  )
}

export default AbsenceListPage
