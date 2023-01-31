// /pages/api/query/roles/roles-queries.tsx
import { gql } from '@apollo/client'

export const ROLES_QUERY = gql`
  query rolesQuery($first: Int, $after: String) {
    roles(first: $first, after: $after) {
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

export const ROLES_DELETE_MUTATION = gql`
  mutation deleteRole($id: String!) {
    deleteRole(id: $id) {
      id
    }
  }
`
