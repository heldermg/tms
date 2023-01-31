// /pages/index.tsx
import Head from 'next/head'
import { useQuery } from '@apollo/client'
import { RoleList } from '../../components/role/RoleList'
import { ROLES_QUERY } from '../api/query/roles/roles-queries'

function RoleListPage() {
  const { data, loading, error, fetchMore } = useQuery(ROLES_QUERY, {
    fetchPolicy: 'no-cache',
  })

  if (loading) return <p>Loading...</p>
  if (error) return <p>Oh no... {error.message}</p>

  //const { endCursor, hasNextPage } = data.roles.pageInfo

  return (
    <div>
      <Head>
        <title>Roles</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <RoleList roles={data?.roles} />
    </div>
  )
}

export default RoleListPage
