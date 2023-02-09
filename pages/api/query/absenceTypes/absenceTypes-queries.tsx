// /pages/api/query/absenceType/absenceType-queries.tsx
import { gql } from '@apollo/client'

export const ABSENCE_TYPE_QUERY = gql`
  query absenceTypes($first: Int, $after: String, $id: String) {
    absenceTypes(first: $first, after: $after, id: $id) {
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        cursor
        node {
          id
          name
          description
        }
      }
    }
  }
`

export const ABSENCE_TYPE_CREATE_MUTATION = gql`
  mutation createAbsenceType(
    $name: String!
    $description: String!
  ) {
    createAbsenceType(name: $name, description: $description) {
      name
      description
    }
  }
`

export const ABSENCE_TYPE_UPDATE_MUTATION = gql`
  mutation updateAbsenceType(
    $id: String!
    $name: String!
    $description: String!
  ) {
    updateAbsenceType(id: $id, name: $name, description: $description) {
      name
      description
    }
  }
`

export const ABSENCE_TYPE_DELETE_MUTATION = gql`
  mutation deleteAbsenceType($id: String!) {
    deleteAbsenceType(id: $id) {
      id
    }
  }
`
