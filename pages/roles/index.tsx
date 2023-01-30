// /pages/index.tsx
import Head from "next/head";
import { gql, useQuery } from "@apollo/client";
import { RoleList } from "../../components/RoleList";

const AllRolesQuery = gql`
  query allRolesQuery($first: Int, $after: String) {
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
`;

function RoleListPage() {
  const { data, loading, error, fetchMore } = useQuery(AllRolesQuery, {});


  if (loading) return <p>Loading...</p>;
  if (error) return <p>Oh no... {error.message}</p>;

  const { endCursor, hasNextPage } = data.roles.pageInfo;

  return (
    <div>
      <Head>
        <title>Roles</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <RoleList roles={data?.roles} />
    </div>
  );
}

export default RoleListPage;