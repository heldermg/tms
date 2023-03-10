// /pages/api/query/users/users-queries.tsx
import { gql } from '@apollo/client'

export const USERS_QUERY = gql`
  query usersQuery(
    $first: Int
    $after: String
    $id: String
    $withoutTeam: Boolean
    $onlyWithTeam: Boolean
  ) {
    users(first: $first, after: $after, id: $id, withoutTeam: $withoutTeam, onlyWithTeam: $onlyWithTeam) {
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
  query usersQuery(
    $first: Int
    $after: String
    $id: String
    $withoutTeam: Boolean
  ) {
    users(first: $first, after: $after, id: $id, withoutTeam: $withoutTeam) {
      edges {
        node {
          id
          name
          email
          profile
          roles {
            id
            name
            acronym
          }
        }
      }
    }
  }
`

export const USERS_CREATE_MUTATION = gql`
  mutation createUser(
    $name: String!
    $email: String!
    $profile: Profile!
    $image: String
    $roles: [String!]
  ) {
    createUser(
      name: $name
      email: $email
      profile: $profile
      image: $image
      roles: $roles
    ) {
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
    $name: String!
    $email: String!
    $profile: Profile!
    $image: String
    $roles: [String!]
  ) {
    updateUser(
      id: $id
      name: $name
      email: $email
      profile: $profile
      image: $image
      roles: $roles
    ) {
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
