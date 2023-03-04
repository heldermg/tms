import { useMutation } from '@apollo/client'
import { getOperationName } from '@apollo/client/utilities'
import { format } from 'date-fns'
import Link from 'next/link'
import React from 'react'
import toast, { Toaster } from 'react-hot-toast'
import {
  ABSENCE_DELETE_MUTATION,
  ABSENCE_QUERY,
} from '../../pages/api/query/absences/absences-queries'
import SvgIcon from '../icons/SvgIcon'
import Switch from "react-switch"

export const AbsenceList = ({ absences }: any) => {
  const [deleteAbsence, { loading }] = useMutation(ABSENCE_DELETE_MUTATION, {
    refetchQueries: [getOperationName(ABSENCE_QUERY)!],
  })

  async function handleDeleteAbsence(id: string) {
    const variables = { id }
    try {
      await toast.promise(deleteAbsence({ variables }), {
        loading: 'Deleting the Absence..',
        success: 'Absence successfully deleted!🎉',
        error: (err) => `Something went wrong 😥\nMessage:\n ${err?.message}`,
      })
    } catch (error: any) {
      console.error(error?.message)
    }
  }

  return (
    <div className="flex flex-col justify-center items-center">
      <Toaster />
      <table className="shadow-lg bg-white table-auto">
        <caption className="px-6 py-3 font-bold text-2xl bg-gray-200">
          Absence List
        </caption>
        <thead>
          <tr>
            <th scope="col" className="bg-blue-50 border text-left px-8 py-4">
              Title
            </th>
            <th scope="col" className="bg-blue-50 border text-left px-8 py-4">
              Team: User
            </th>
            <th scope="col" className="bg-blue-50 border text-center px-8 py-4">
              Absence Type
            </th>
            <th scope="col" className="bg-blue-50 border text-center px-8 py-4">
              Start Date At
            </th>
            <th scope="col" className="bg-blue-50 border text-center px-8 py-4">
              End Date At
            </th>
            <th scope="col" className="bg-blue-50 border text-center px-8 py-4">
              All Day ?
            </th>
            <th scope="col" className="bg-blue-50 border text-center px-8 py-4">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {absences.edges.map(({ node }: { node: any }) => (
            <tr key={node.id}>
              <td className="px-6 py-4">{node.title}</td>
              <td className="px-6 py-4">{`${node.user.team?.name}: ${node.user.name}`}</td>
              <td className="px-6 py-4">{node.absenceType.name}</td>
              <td className="px-6 py-4 text-center">
                {format(new Date(node.startDateAt.slice(0, -1)), 'dd/MM/yyyy')}
              </td>
              <td className="px-6 py-4 text-center">
                {format(new Date(node.endDateAt.slice(0, -1)), 'dd/MM/yyyy')}
              </td>
              <td className="px-6 py-4">
                <Switch
                  disabled
                  onChange={() => {}}
                  checked={node.isAllDay}
                  className="react-switch"
                />
              </td>
              <td className="px-6 py-4 grid grid-cols-3 text-center">
                <Link href={`/absences/${node.id}`}>
                  <a className="inline-flex items-center border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0">
                    <SvgIcon
                      iconType="magnifying-glass-plus"
                      title="Detail"
                      desc="Detail Button"
                      className="w-6 h-6"
                    />
                  </a>
                </Link>
                <Link href={`/absences/${node.id}/edit`}>
                  <a className="inline-flex items-center border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0">
                    <SvgIcon
                      iconType="pencil-square"
                      title="Edit"
                      desc="Edit Button"
                      className="w-6 h-6"
                    />
                  </a>
                </Link>
                <button
                  disabled={loading}
                  onClick={() => {
                    if (
                      window.confirm(
                        `Are you sure you want to delete the Absence ${node.title} ?`
                      )
                    )
                      handleDeleteAbsence(node.id)
                  }}
                  className="inline-flex items-center border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0"
                >
                  <SvgIcon
                    iconType="trash"
                    title="Delete"
                    desc="Delete Button"
                    className="w-6 h-6"
                  />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td></td>
            <td colSpan={6}>
              <div className="flex flex-row justify-end">
                <Link href={`/absences/new`}>
                  <a className="inline-flex items-center border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                      Add New Absence
                    </button>
                  </a>
                </Link>
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
