// pages/teams/[teamId]/edit.tsx
import React from 'react'
import { useQuery } from '@apollo/client'
import toast from 'react-hot-toast'
import { User } from '@prisma/client'
import { useRouter } from 'next/router'
import { USERS_QUERY } from '../../api/query/users/users-queries'
import { UserForm } from '../../../components/user/UserForm'

const EditUserPage = () => {
  const router = useRouter()
  const userId = router.query.userId as string

  if (!userId) {
    toast.error('Id not informed')
  }

  const { data, loading, error } = useQuery(USERS_QUERY, {
    variables: { id: userId },
    fetchPolicy: 'no-cache',
  })

  if (loading) return <p>Loading...</p>
  if (error) return <p>Oh no... {error.message}</p>

  const nodes = data?.users.edges.map(({ node }: { node: User }) => node)
  const user = nodes.shift()

  console.log(user);
  

  return (
    <UserForm user={user} />
  )
}

export default EditUserPage
