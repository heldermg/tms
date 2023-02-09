// pages/roles/new.tsx
import React from 'react'
import { AbsenceTypeForm } from '../../components/absenceType/AbsenceTypeForm'

const AbsenceTypeNewPage = () => {
  return <AbsenceTypeForm />
}

export default AbsenceTypeNewPage

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
