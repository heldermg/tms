import { useMutation, useQuery } from '@apollo/client'
import { Absence, AbsenceType, User } from '@prisma/client'
import Link from 'next/link'
import React from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { toast, Toaster } from 'react-hot-toast'
import {
  ABSENCE_CREATE_MUTATION,
  ABSENCE_QUERY,
  ABSENCE_UPDATE_MUTATION,
} from '../../pages/api/query/absences/absences-queries'
import { FormType } from '../form-util'
import SvgIcon from '../icons/SvgIcon'
import { USERS_QUERY } from '../../pages/api/query/users/users-queries'
import { ABSENCE_TYPE_QUERY } from '../../pages/api/query/absenceTypes/absenceTypes-queries'
import 'react-datepicker/dist/react-datepicker.css'
import DatePicker, { registerLocale } from 'react-datepicker'
import ptBR from 'date-fns/locale/pt-BR'
import { getOperationName } from '@apollo/client/utilities'
registerLocale('pt-BR', ptBR)

type FormValues = {
  title: string
  description: string
  startDateAt: Date
  endDateAt: Date
  startTimeAt?: Date
  endTimeAt?: Date
  isAllDay: boolean
  userId: string
  absenceTypeId: string
  users?: string[]
  absenceTypes?: string[]
}

interface AbsenceFormProps {
  absence?: Absence
  users?: string[]
  absenceTypes?: string[]
}

export const AbsenceForm = ({
  absence,
  users,
  absenceTypes,
}: AbsenceFormProps) => {
  const {
    id,
    title,
    description,
    startDateAt,
    endDateAt,
    startTimeAt,
    endTimeAt,
    isAllDay,
    userId,
    absenceTypeId,
  } = absence || {}

  const isEdit = id ? true : false
  let formType: FormType = id ? FormType.EDIT : FormType.NEW

  const buttonLabel = isEdit ? 'Update Absence' : 'Create new Absence'
  const loadingButtonLabel = isEdit ? 'Updating...' : 'Creating...'

  const { register, handleSubmit, reset, control } = useForm<FormValues>({
    defaultValues: {
      title,
      description,
      startDateAt,
      endDateAt,
      startTimeAt: startTimeAt ? startTimeAt : undefined,
      endTimeAt: endTimeAt ? endTimeAt : undefined,
      isAllDay,
      userId,
      absenceTypeId,
      users: users ? users : undefined,
      absenceTypes: absenceTypes ? absenceTypes : undefined,
    },
  })

  const [createAbsence, { loading: loadingCreate }] = useMutation(
    ABSENCE_CREATE_MUTATION,
    {
      onCompleted: () => reset(),
      refetchQueries: [getOperationName(USERS_QUERY)!, getOperationName(ABSENCE_TYPE_QUERY)!],
    }
  )

  const [updateAbsence, { loading: loadingUpdate }] = useMutation(
    ABSENCE_UPDATE_MUTATION,
    {
      refetchQueries: [getOperationName(ABSENCE_QUERY)!],
    }
  )

  const {
    data: usersData,
    loading: usersLoading,
    error: usersError,
  } = useQuery(USERS_QUERY, {
    variables: {
      onlyWithTeam: true,
    },
    fetchPolicy: 'no-cache',
  })

  const {
    data: absenceTypesData,
    loading: absenceTypesLoading,
    error: absenceTypesError,
  } = useQuery(ABSENCE_TYPE_QUERY, {
    fetchPolicy: 'no-cache',
  })

  if (usersError) return <p>Oh no... {usersError.message}</p>
  if (absenceTypesError) return <p>Oh no... {absenceTypesError.message}</p>

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const {
      title,
      description,
      startDateAt,
      endDateAt,
      startTimeAt,
      endTimeAt,
      isAllDay,
      userId,
      absenceTypeId,
    } = data
    const variables = {
      id: isEdit ? id : null,
      title,
      description,
      startDateAt,
      endDateAt,
      startTimeAt,
      endTimeAt,
      isAllDay,
      userId,
      absenceTypeId,
    }
    try {
      if (isEdit) {
        await toast.promise(updateAbsence({ variables }), {
          loading: 'Updating the Absence...',
          success: 'Absence successfully updated!🎉',
          error: (err) => `Something went wrong 😥\nMessage:\n ${err?.message}`,
        })
      } else {
        await toast.promise(createAbsence({ variables }), {
          loading: 'Creating new Absence...',
          success: 'Absence successfully created!🎉',
          error: (err) => `Something went wrong 😥\nMessage:\n ${err?.message}`,
        })
      }
    } catch (error: any) {
      console.error(error?.message)
    }
  }

  function sanitizeTime(oldTime: any) {
    const regex = /^\d\d:\d\d:\d\d.\d\d\dZ/i

    if (oldTime && oldTime.value && regex.test(oldTime.value)) {
      console.log('Time')
      const value = oldTime.value
      const hours = value.substring(0, 2)
      const minutes = value.substring(3, 5)

      const newTime = new Date(1970, 0, 1)
      newTime.setHours(+hours)
      newTime.setMinutes(+minutes)
      newTime.setSeconds(0)
      console.log(newTime)
      
      oldTime.onChange(newTime)
      return newTime
    }
    return oldTime?.value
  }

  function sanitizeDateOffset(oldDate: any) {
    if (oldDate) {
      const newDate = new Date(oldDate)
      newDate.setMinutes(newDate.getMinutes() + newDate.getTimezoneOffset())
      return newDate
    }
    return oldDate
  }

  return (
    <div className="container mx-auto max-w-md py-12">
      <Toaster />
      <h1 className="text-3xl font-medium my-5 text-center">
        {formType} Absence
      </h1>
      <form
        className="grid grid-cols-1 gap-y-6 shadow-lg p-8 rounded-lg"
        onSubmit={handleSubmit(onSubmit)}
      >
        <label className="block">
          <span className="text-gray-700">Title</span>
          <input
            placeholder="Title"
            {...register('title', { required: true })}
            name="title"
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
        <label className="block">
          <span className="text-gray-700">User</span>
          {usersLoading ? (
            <span>Loandig users</span>
          ) : (
            <select
              required={true}
              placeholder="User"
              {...register('userId', { required: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              {usersData?.users.edges.map(({ node }: { node: User }) => (
                <option key={node.id} value={node.id}>
                  {node.name} - {node.email}
                </option>
              ))}
            </select>
          )}
        </label>
        <label className="block">
          <span className="text-gray-700">Absence Type</span>
          {absenceTypesLoading ? (
            <span>Loandig absence types</span>
          ) : (
            <select
              required={true}
              placeholder="Absence Type"
              {...register('absenceTypeId', { required: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              {absenceTypesData?.absenceTypes.edges.map(
                ({ node }: { node: AbsenceType }) => (
                  <option key={node.id} value={node.id}>
                    {node.name}
                  </option>
                )
              )}
            </select>
          )}
        </label>
        <span className="flex flex-row">
          <span className="block">
            <span className="text-gray-700">Start Date</span>
            <Controller
              control={control}
              name="startDateAt"
              render={({ field }) => (
                <DatePicker
                  required={true}
                  shouldCloseOnSelect={true}
                  placeholderText="dd/MM/yyyy"
                  className="w-2/3"
                  onChange={(date: any) => field.onChange(date)}
                  selected={sanitizeDateOffset(field.value)}
                  dateFormat="dd/MM/yyyy"
                  locale="pt-BR"
                />
              )}
            />
          </span>
          <span className="block">
            <span className="text-gray-700">End Date</span>
            <Controller
              control={control}
              name="endDateAt"
              render={({ field }) => (
                <DatePicker
                  required={true}
                  shouldCloseOnSelect={true}
                  placeholderText="dd/MM/yyyy"
                  className="w-2/3"
                  onChange={(date: any) => field.onChange(date)}
                  selected={sanitizeDateOffset(field.value)}
                  dateFormat="dd/MM/yyyy"
                  locale="pt-BR"
                />
              )}
            />
          </span>
        </span>
        <span className="flex flex-row">
          <span className="block">
            <span className="text-gray-700">Start Time</span>
            <Controller
              control={control}
              name="startTimeAt"
              render={({ field }) => (
                <DatePicker
                  className="w-2/3"
                  showTimeSelect={true}
                  showTimeSelectOnly={true}
                  shouldCloseOnSelect={true}
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  placeholderText="HH:mm"
                  onChange={(date: any) => field.onChange(date)}
                  selected={sanitizeTime(field)}
                  dateFormat="HH:mm"
                  locale="pt-BR"
              />
              )}
            />
          </span>
          <span className="block">
            <span className="text-gray-700">End Time</span>
            <Controller
              control={control}
              name="endTimeAt"
              render={({ field }) => (
                <DatePicker
                  className="w-2/3"
                  showTimeSelect={true}
                  showTimeSelectOnly={true}
                  shouldCloseOnSelect={true}
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  placeholderText="HH:mm"
                  onChange={(date: any) => field.onChange(date)}
                  selected={sanitizeTime(field)}
                  dateFormat="HH:mm"
                  locale="pt-BR"
                />
              )}
            />
          </span>
        </span>

        <button
          disabled={loadingCreate || loadingUpdate}
          type="submit"
          className="capitalize bg-blue-500 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-600"
        >
          {loadingCreate || loadingUpdate ? (
            <span className="flex items-center justify-center">
              <SvgIcon
                iconType="animate-spin"
                className="w-6 h-6 animate-spin mr-1"
                title="Animate Spin"
                desc="Animate Spin"
              />
              <span>{loadingButtonLabel}</span>
            </span>
          ) : (
            <span>{buttonLabel}</span>
          )}
        </button>
        <Link href={`/absences/`}>
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
