// /pages/index.tsx
import Head from "next/head";
import { gql, useQuery, useMutation } from "@apollo/client";
import { RoleDetail } from "../components/RoleDetail";
import type { Role } from "@prisma/client";

const AllRolesQuery = gql`
  query allRolesQuery($first: Int, $after: ID) {
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

function Home() {
  const { data, loading, error, fetchMore } = useQuery(AllRolesQuery, {
    variables: { first: 2 },
  });


  if (loading) return <p>Loading...</p>;
  if (error) return <p>Oh no... {error.message}</p>;

  const { endCursor, hasNextPage } = data.roles.pageInfo;

  return (
    <div>
      <Head>
        <title>Roles</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container mx-auto max-w-5xl my-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {data?.roles.edges.map(({ node }: { node: Role }) => (
            <RoleDetail
              key={node.id}
              id={node.id}
              name={node.name}
              acronym={node.acronym}
              description={node.description}
            />
          ))}
        </div>
        {hasNextPage ? (
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded my-10"
            onClick={() => {
              fetchMore({
                variables: { after: endCursor },
                updateQuery: (prevResult, { fetchMoreResult }) => {
                  fetchMoreResult.roles.edges = [
                    ...prevResult.roles.edges,
                    ...fetchMoreResult.roles.edges,
                  ];
                  return fetchMoreResult;
                },
              });
            }}
          >
            more
          </button>
        ) : (
          <p className="my-10 text-center font-medium">
            You've reached the end!{" "}
          </p>
        )}
      </div>
    </div>
  );
}

export default Home;