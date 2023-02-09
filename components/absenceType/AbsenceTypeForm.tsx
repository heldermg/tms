import { useMutation } from '@apollo/client'
import { getOperationName } from '@apollo/client/utilities'
import { AbsenceType } from '@prisma/client'
import Link from 'next/link'
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast, Toaster } from 'react-hot-toast'
import { ABSENCE_TYPE_CREATE_MUTATION, ABSENCE_TYPE_QUERY, ABSENCE_TYPE_UPDATE_MUTATION } from '../../pages/api/query/absenceTypes/absenceTypes-queries'
import { FormType } from '../form-util'
import SvgIcon from '../icons/SvgIcon'

type FormValues = {
  name: string
  description: string
}

interface AbsenceTypeFormProps {
  absenceType?: AbsenceType,
}

export const AbsenceTypeForm = ({ absenceType }: AbsenceTypeFormProps) => {
  const { id, name, description } = absenceType || {}

  const isEdit = id ? true : false
  let formType: FormType = id ? FormType.EDIT : FormType.NEW

  const buttonLabel = isEdit ? "Update Absence Type" : "Create new Absence Type"
  const loadingButtonLabel = isEdit ? "Updating..." : "Creating..."

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      name,
      description
    }
  })

  const [updateAbsenceType, { loading: loadingUpdate, error: errorUpdate }] = useMutation(ABSENCE_TYPE_UPDATE_MUTATION, {
    refetchQueries: [{ query: ABSENCE_TYPE_QUERY }, getOperationName(ABSENCE_TYPE_QUERY)!]
  })

  const [createAbsenceType, { loading: loadingCreate, error: errorCreate }] = useMutation(ABSENCE_TYPE_CREATE_MUTATION, {
    onCompleted: () => reset(),
  })

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const { name, description } = data
    const variables = { id: (isEdit ? id : null), name, description }
    try {
      if (isEdit) {
        await toast.promise(updateAbsenceType({ variables }), {
          loading: 'Updating the Absence Type..',
          success: 'Absence Type successfully updated!🎉',
          error: (err) => `Something went wrong 😥\nMessage:\n ${err?.message}`,
        })
      } else {
        await toast.promise(createAbsenceType({ variables }), {
          loading: 'Creating new Absence Type..',
          success: 'Absence Type successfully created!🎉',
          error: (err) => `Something went wrong 😥\nMessage:\n ${err?.message}`,
        })
      }
    } catch (error: any) {
      console.error(error?.message)
    }
  }
  
  return (
    <div className="container mx-auto max-w-md py-12">
      <Toaster />
      <h1 className="text-3xl font-medium my-5 text-center">{formType} Absence Type</h1>
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
            maxLength={30}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </label>
        <label className="block">
          <span className="text-gray-700">Description</span>
          <textarea
            placeholder="Description"
            {...register('description', { required: true })}
            name="description"
            rows={4}
            maxLength={200}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </label>

        <button
          disabled={loadingCreate || loadingUpdate}
          type="submit"
          className="capitalize bg-blue-500 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-600"
        >
          {loadingCreate || loadingUpdate ? (
            <span className="flex items-center justify-center">
              <SvgIcon
                iconType='animate-spin'
                className='w-6 h-6 animate-spin mr-1'
                title='Animate Spin'
                desc='Animate Spin'
              />
              <span>{loadingButtonLabel}</span>
            </span>
          ) : (
            <span>{buttonLabel}</span>
          )}
        </button>
          <Link href={`/absenceTypes/`}>
            <a className="w-full">
              <button
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
