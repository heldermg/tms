// /pages/teams/index.tsx

import Head from 'next/head'
import { useQuery } from '@apollo/client'
import { UserList } from '../../components/user/UserList'
import { USERS_QUERY } from '../api/query/users/users-queries'
import { Vortex } from 'react-loader-spinner'

function UserListPage() {
  const { data, loading, error, fetchMore } = useQuery(USERS_QUERY, {
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

  //const { endCursor, hasNextPage } = data.teams.pageInfo;

  return (
    <div>
      <Head>
        <title>Teams</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <UserList users={data?.users} />
    </div>
  )
}

export default UserListPage
