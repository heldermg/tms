// /pages/teams/index.tsx

import Head from "next/head"
import { gql, useQuery } from "@apollo/client"
import type { Team } from "@prisma/client"
import { TeamList } from "../../components/TeamList"

const AllTeamsQuery = gql`
  query allTeamsQuery($first: Int, $after: ID) {
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
          members {
            id
          }
        }
      }
    }
  }
`

function TeamListPage() {
  const { data, loading, error, fetchMore } = useQuery(AllTeamsQuery, {});


  if (loading) return <p>Loading...</p>;
  if (error) return <p>Oh no... {error.message}</p>;

  const { endCursor, hasNextPage } = data.teams.pageInfo;

  return (
    <div>
      <Head>
        <title>Teams</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <TeamList teams={data?.teams} />
    </div>
  );
}

export default TeamListPage;