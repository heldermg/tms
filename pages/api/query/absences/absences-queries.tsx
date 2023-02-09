// /pages/api/query/absenceType/absenceType-queries.tsx
import { gql } from '@apollo/client'

export const ABSENCE_QUERY = gql`
  query absences($first: Int, $after: String, $id: String) {
    absences(first: $first, after: $after, id: $id) {
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        cursor
        node {
          id
          title
          description
        }
      }
    }
  }
`

/*export const ABSENCE_CREATE_MUTATION = gql`
  mutation createAbsence(
    $title: String!
    $description: String!
  ) {
    createAbsence(title: $title, description: $description) {
      title
      description
    }
  }
`*/

/*export const ABSENCE_UPDATE_MUTATION = gql`
  mutation updateAbsence(
    $id: String!
    $title: String!
    $description: String!
  ) {
    updateAbsence(id: $id, title: $title, description: $description) {
      title
      description
    }
  }
`*/

export const ABSENCE_DELETE_MUTATION = gql`
  mutation deleteAbsence($id: String!) {
    deleteAbsence(id: $id) {
      id
    }
  }
`
