// /pages/api/query/users/users-queries.tsx
import { gql } from '@apollo/client'

export const USERS_QUERY = gql`
  query usersQuery($first: Int, $after: String, $withoutTeam: Boolean) {
    users(first: $first, after: $after, withoutTeam: $withoutTeam) {
      edges {
        node {
          id
          name
          email
        }
      }
    }
  }
`

export const USERS_DELETE_MUTATION = gql`
  mutation deleteUser($id: String!) {
    deleteUser(id: $id) {
      id
    }
  }
`