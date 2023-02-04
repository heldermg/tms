// pages/roles/new.tsx
import React from 'react'
import { RoleForm } from '../../components/role/RoleForm'

const NewRolePage = () => {
  return <RoleForm />
}

export default NewRolePage

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
