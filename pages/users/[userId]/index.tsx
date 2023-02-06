// pages/users/[userId]/index.tsx
import React from 'react'
import { useQuery } from '@apollo/client'
import toast from 'react-hot-toast'
import { Team } from '@prisma/client'
import { USERS_QUERY } from '../../api/query/users/users-queries'
import { useRouter } from 'next/router'
import { UserDetail } from '../../../components/user/UserDetail'

const DetailUserPage = () => {
  const router = useRouter()
  const userId = router.query.userId as string

  if (!userId) {
    toast.error('Id not informed')
  }

  const { data, loading: userLoading, error } = useQuery(USERS_QUERY, {
    variables: { id: userId },
    fetchPolicy: 'no-cache',
  })

  const nodes = data?.users.edges.map(({ node }: { node: Team }) => node)
  const user = nodes?.shift()

  if (userLoading) return <p>Loading...</p>
  if (error) return <p>Oh no... {error.message}</p>

  return (
    <UserDetail 
      user={user} 
      userLoading={userLoading} 
    />
  )
}

export default DetailUserPage
