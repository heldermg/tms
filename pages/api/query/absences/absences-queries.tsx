// /pages/api/query/absences/absences-queries.tsx
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
          startDateAt
          endDateAt
          startTimeAt
          endTimeAt
          isAllDay
          userId
          user {
            id
            name
            team {
              name
            }
          }
          absenceTypeId
          absenceType {
            id
            name
          }
        }
      }
    }
  }
`

export const ABSENCE_CREATE_MUTATION = gql`
  mutation createAbsence(
    $title: String!
    $description: String!
    $startDateAt: Date!
    $endDateAt: Date!
    $startTimeAt: Date
    $endTimeAt: Date
    $userId: String!
    $absenceTypeId: String!
  ) {
    createAbsence(
      title: $title
      description: $description
      startDateAt: $startDateAt
      endDateAt: $endDateAt
      startTimeAt: $startTimeAt
      endTimeAt: $endTimeAt
      userId: $userId
      absenceTypeId: $absenceTypeId
    ) {
      title
      description
      startDateAt
      endDateAt
      startTimeAt
      endTimeAt
      isAllDay
      userId
      absenceTypeId
    }
  }
`

export const ABSENCE_UPDATE_MUTATION = gql`
  mutation updateAbsence(
    $id: String!
    $title: String!
    $description: String!
    $startDateAt: Date!
    $endDateAt: Date!
    $startTimeAt: Date
    $endTimeAt: Date
    $userId: String!
    $absenceTypeId: String!
  ) {
    updateAbsence(
      id: $id, 
      title: $title
      description: $description
      startDateAt: $startDateAt
      endDateAt: $endDateAt
      startTimeAt: $startTimeAt
      endTimeAt: $endTimeAt
      userId: $userId
      absenceTypeId: $absenceTypeId  
    ) {
      title
      description
      startDateAt
      endDateAt
      startTimeAt
      endTimeAt
      isAllDay
      userId
      absenceTypeId
    }
  }
`

export const ABSENCE_DELETE_MUTATION = gql`
  mutation deleteAbsence($id: String!) {
    deleteAbsence(id: $id) {
      id
    }
  }
`
