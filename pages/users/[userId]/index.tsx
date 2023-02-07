// pages/users/[userId]/index.tsx
import React from 'react'
import { useQuery } from '@apollo/client'
import toast from 'react-hot-toast'
import { Team } from '@prisma/client'
import { USERS_QUERY_WITH_ROLES } from '../../api/query/users/users-queries'
import { useRouter } from 'next/router'
import { UserDetail } from '../../../components/user/UserDetail'
import { Vortex } from 'react-loader-spinner'

const DetailUserPage = () => {
  const router = useRouter()
  const userId = router.query.userId as string

  if (!userId) {
    toast.error('Id not informed')
  }

  const { data, loading: userLoading, error } = useQuery(USERS_QUERY_WITH_ROLES, {
    variables: { id: userId },
    fetchPolicy: 'no-cache',
  })

  const nodes = data?.users.edges.map(({ node }: { node: Team }) => node)
  const user = nodes?.shift()

  if (userLoading) return (
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

  return (
    <UserDetail 
      user={user} 
      userLoading={userLoading} 
      roles={user.roles}
    />
  )
}

export default DetailUserPage
