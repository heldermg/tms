// pages/roles/new.tsx

import React from 'react'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { useMutation } from '@apollo/client'
import toast, { Toaster } from 'react-hot-toast'
import Link from 'next/link'
import { ROLES_CREATE_MUTATION } from '../api/query/roles/roles-queries'
import SvgIcon from '../../components/icons/SvgIcon'

type FormValues = {
  name: string
  acronym: string
  description: string
}

const NewRoleForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>()

  const [createRole, { loading, error }] = useMutation(ROLES_CREATE_MUTATION, {
    onCompleted: () => reset(),
  })

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const { name, acronym, description } = data
    const variables = { name, acronym, description }
    try {
      await toast.promise(createRole({ variables }), {
        loading: 'Creating new Role..',
        success: 'Role successfully created!🎉',
        error: `Something went wrong 😥 Please try again -  ${error}`,
      })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="container mx-auto max-w-md py-12">
      <Toaster />
      <h1 className="text-3xl font-medium my-5">Create a new Role</h1>
      <form
        className="grid grid-cols-1 gap-y-6 shadow-lg p-8 rounded-lg"
        onSubmit={handleSubmit(onSubmit)}
      >
        <label className="block">
          <span className="text-gray-700">Name</span>
          <input
            placeholder="Name"
            {...register('name', { required: true })}
            name="name"
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </label>
        <label className="block">
          <span className="text-gray-700">Acronym</span>
          <input
            placeholder="Acronym"
            {...register('acronym', { required: true })}
            name="acronym"
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </label>
        <label className="block">
          <span className="text-gray-700">Description</span>
          <input
            placeholder="Description"
            {...register('description', { required: true })}
            name="description"
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </label>

        <button
          disabled={loading}
          type="submit"
          className="capitalize bg-blue-500 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-600"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <SvgIcon
                iconType='animate-spin'
                className='w-6 h-6 animate-spin mr-1'
                title='Animate Spin'
                desc='Animate Spin Creating'
              />
              Creating...
            </span>
          ) : (
            <span>Create Role</span>
          )}
        </button>
        <Link href={`/roles/`}>
          <a className="w-full">
            <button
              disabled={loading}
              type="button"
              className="w-full capitalize bg-gray-500 text-white font-medium py-2 px-4 rounded-md hover:bg-gray-600"
            >
              Voltar
            </button>
          </a>
        </Link>
      </form>
    </div>
  )
}

export default NewRoleForm

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
