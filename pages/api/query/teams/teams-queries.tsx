// /pages/api/query/teams/teams-queries.tsx
import { gql } from '@apollo/client'

export const TEAMS_QUERY = gql`
  query teamsQuery($first: Int, $after: String) {
    teams(first: $first, after: $after) {
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        cursor
        node {
          id
          name
          managerId
          members {
            id
            name
          }
        }
      }
    }
  }
`

export const TEAMS_CREATE_MUTATION = gql`
  mutation createTeam($name: String!, $managerId: String!) {
    createTeam(name: $name, managerId: $managerId) {
      name
      managerId
    }
  }
`

export const TEAMS_DELETE_MUTATION = gql`
  mutation deleteTeam($id: String!) {
    deleteTeam(id: $id) {
      id
    }
  }
`
