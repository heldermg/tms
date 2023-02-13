// pages/absences/new.tsx
import React from 'react'
import { AbsenceForm } from '../../components/absence/AbsenceForm'

const AbsenceNewPage = () => {
  return <AbsenceForm />
}

export default AbsenceNewPage

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
