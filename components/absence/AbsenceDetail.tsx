import { Absence, AbsenceType, User } from '@prisma/client'
import Link from 'next/link'
import { Toaster } from 'react-hot-toast'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { sanitizeDateOffset, sanitizeTime } from '../../lib/time'

interface AbsenceDetailProps {
  absence: Absence
  absenceLoading: boolean
  user: User
  userLoading: boolean
  absenceType: AbsenceType
  absenceTypeLoading: boolean
}

export const AbsenceDetail = ({
  absence,
  absenceLoading,
  user,
  userLoading,
  absenceType,
  absenceTypeLoading,
}: AbsenceDetailProps) => {
  const {
    title,
    description,
    startDateAt,
    endDateAt,
    startTimeAt,
    endTimeAt,
    userId,
    absenceTypeId,
  } = absence

  return (
    <div className="container mx-auto max-w-md py-12">
      <Toaster />
      <h1 className="text-3xl font-medium my-5 text-center">Detail Absence</h1>
      <div className="grid grid-cols-1 gap-y-6 shadow-lg p-8 rounded-lg">
        <label className="block">
          <span className="text-gray-700">Title</span>
          <input
            placeholder="Name"
            value={title}
            disabled
            name="name"
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </label>
        <label className="block">
          <span className="text-gray-700">Description</span>
          <textarea
            placeholder="Description"
            value={description}
            disabled
            name="description"
            rows={4}
            maxLength={200}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </label>
        <label className="block">
          <span className="text-gray-700">User</span>
          {userLoading ? (
            <div>Loandig User</div>
          ) : (
            <select
              required={false}
              value={userId}
              disabled
              placeholder="User"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value={userId}>
                {user.name} - {user.email}
              </option>
            </select>
          )}
        </label>
        <label className="block">
          <span className="text-gray-700">Absence Type</span>
          {absenceTypeLoading ? (
            <div>Loandig Absence Type</div>
          ) : (
            <select
              required={false}
              value={absenceTypeId}
              disabled
              placeholder="User"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value={absenceTypeId}>{absenceType.name}</option>
            </select>
          )}
        </label>
        <span className="flex flex-row">
          <span className="block">
            <span className="text-gray-700">Start Date</span>
            <DatePicker
              disabled={true}
              className="w-2/3"
              onChange={() => {}}
              selected={sanitizeDateOffset(startDateAt)}
              dateFormat="dd/MM/yyyy"
              locale="pt-BR"
            />
          </span>
          <span className="block">
            <span className="text-gray-700">End Date</span>
            <DatePicker
              disabled={true}
              className="w-2/3"
              onChange={() => {}}
              selected={sanitizeDateOffset(endDateAt)}
              dateFormat="dd/MM/yyyy"
              locale="pt-BR"
            />
          </span>
        </span>
        <span className="flex flex-row">
          <span className="block">
            <span className="text-gray-700">Start Time</span>
            <DatePicker
              disabled={true}
              className="w-2/3"
              showTimeSelect={true}
              showTimeSelectOnly={true}
              timeFormat="HH:mm"
              onChange={() => {}}
              selected={sanitizeTime(startTimeAt)}
              dateFormat="HH:mm"
              locale="pt-BR"
            />
          </span>
          <span className="block">
            <span className="text-gray-700">End Time</span>
            <DatePicker
              disabled={true}
              className="w-2/3"
              showTimeSelect={true}
              showTimeSelectOnly={true}
              timeFormat="HH:mm"
              onChange={() => {}}
              selected={sanitizeTime(endTimeAt)}
              dateFormat="HH:mm"
              locale="pt-BR"
            />
          </span>
        </span>

        <div className="capitalize font-medium py-2 px-4 rounded-md">
          <Link href={`/absences/`}>
            <a className="w-full">
              <button
                disabled={absenceLoading}
                type="button"
                className="w-full capitalize bg-gray-500 text-white font-medium py-2 px-4 rounded-md hover:bg-gray-600"
              >
                Voltar
              </button>
            </a>
          </Link>
        </div>
      </div>
    </div>
  )
}
