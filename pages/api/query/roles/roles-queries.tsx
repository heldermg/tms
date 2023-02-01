// /pages/api/query/roles/roles-queries.tsx
import { gql } from '@apollo/client'

export const ROLES_QUERY = gql`
  query rolesQuery($first: Int, $after: String, $id: String) {
    roles(first: $first, after: $after, id: $id) {
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        cursor
        node {
          id
          name
          acronym
          description
        }
      }
    }
  }
`

export const ROLES_CREATE_MUTATION = gql`
  mutation createRole(
    $name: String!
    $acronym: String!
    $description: String!
  ) {
    createRole(name: $name, acronym: $acronym, description: $description) {
      name
      acronym
      description
    }
  }
`

export const ROLES_UPDATE_MUTATION = gql`
  mutation updateRole(
    $id: String!
    $name: String!
    $acronym: String!
    $description: String!
  ) {
    updateRole(id: $id, name: $name, acronym: $acronym, description: $description) {
      name
      acronym
      description
    }
  }
`

export const ROLES_DELETE_MUTATION = gql`
  mutation deleteRole($id: String!) {
    deleteRole(id: $id) {
      id
    }
  }
`
