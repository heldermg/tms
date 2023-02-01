// /pages/teams/index.tsx

import Head from 'next/head'
import { useQuery } from '@apollo/client'
import { UserList } from '../../components/user/UserList'
import { USERS_QUERY } from '../api/query/users/users-queries'

function UserListPage() {
  const { data, loading, error, fetchMore } = useQuery(USERS_QUERY, {
    fetchPolicy: 'no-cache',
  })

  console.log(error);

  if (loading) return <p>Loading...</p>
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
