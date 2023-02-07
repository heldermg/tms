// /pages/index.tsx
import Head from 'next/head'
import { useQuery } from '@apollo/client'
import { RoleList } from '../../components/role/RoleList'
import { ROLES_QUERY } from '../api/query/roles/roles-queries'
import { Vortex } from 'react-loader-spinner'

function ListRolePage() {
  const { data, loading, error, fetchMore } = useQuery(ROLES_QUERY, {
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
        <title>Roles</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <RoleList roles={data?.roles} />
    </div>
  )
}

export default ListRolePage
