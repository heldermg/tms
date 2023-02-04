// pages/teams/new.tsx
import React from 'react'
import { TeamForm } from '../../components/team/TeamForm'

const NewTeamPage = () => {
  return <TeamForm />
}

export default NewTeamPage

/*export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession(req, res);

  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: '/api/auth/login',
      },
      props: {},
    }
  }

  return {
    props: {},
  };
}*/
