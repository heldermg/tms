// /pages/api/query/users/users-queries.tsx
import { gql } from '@apollo/client'

export const USERS_QUERY = gql`
  query usersQuery($first: Int, $after: String, $withoutTeam: Boolean, $id: String) {
    users(first: $first, after: $after, withoutTeam: $withoutTeam, id: $id) {
      edges {
        node {
          id
          name
          email
          profile
        }
      }
    }
  }
`

export const USERS_QUERY_WITH_ROLES = gql`
  query usersQuery($first: Int, $after: String, $withoutTeam: Boolean, $id: String) {
    users(first: $first, after: $after, withoutTeam: $withoutTeam, id: $id) {
      edges {
        node {
          id
          name
          email
          profile
          roles {
            id
          }
        }
      }
    }
  }
`

export const USERS_CREATE_MUTATION = gql`
  mutation createUser(
    $name: String!, 
    $email: String!, 
    $profile: Profile!, 
    $image: String,
    $roles: [String!],
  ) {
    createUser(name: $name, email: $email, profile: $profile, image: $image, roles: $roles) {
      name
      email
      profile
      image
    }
  }
`

export const USERS_UPDATE_MUTATION = gql`
  mutation updateUser(
    $id: String!
    $name: String!, 
    $email: String!, 
    $profile: Profile!, 
    $image: String,
    $roles: [String!],
  ) {
    updateUser(id: $id, name: $name, email: $email, profile: $profile, image: $image, roles: $roles) {
      name
      email
      profile
      image
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