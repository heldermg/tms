import { useMutation } from '@apollo/client'
import { getOperationName } from '@apollo/client/utilities'
import { AbsenceType } from '@prisma/client'
import Link from 'next/link'
import React from 'react'
import toast, { Toaster } from 'react-hot-toast'
import {
  ABSENCE_TYPE_DELETE_MUTATION,
  ABSENCE_TYPE_QUERY,
} from '../../pages/api/query/absenceTypes/absenceTypes-queries'
import SvgIcon from '../icons/SvgIcon'

export const AbsenceTypeList = ({ absenceTypes }: any) => {
  const [deleteAbsenceType, { loading }] = useMutation(
    ABSENCE_TYPE_DELETE_MUTATION,
    {
      refetchQueries: [getOperationName(ABSENCE_TYPE_QUERY)!],
    }
  )

  async function handleDeleteAbsenceType(id: string) {
    const variables = { id }
    try {
      await toast.promise(deleteAbsenceType({ variables }), {
        loading: 'Deleting the Absence Type..',
        success: 'Absence Type successfully deleted!🎉',
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
          Absence Type List
        </caption>
        <thead>
          <tr>
            <th scope="col" className="bg-blue-50 border text-left px-8 py-4">
              Name
            </th>
            <th scope="col" className="bg-blue-50 border text-center px-8 py-4">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {absenceTypes.edges.map(({ node }: { node: AbsenceType }) => (
            <tr key={node.id}>
              <td className="px-6 py-4">{node.name}</td>
              <td className="px-6 py-4 grid grid-cols-3 text-center">
                <Link href={`/absenceTypes/${node.id}`}>
                  <a className="inline-flex items-center border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0">
                    <SvgIcon
                      iconType="magnifying-glass-plus"
                      title="Detail"
                      desc="Detail Button"
                      className="w-6 h-6"
                    />
                  </a>
                </Link>
                <Link href={`/absenceTypes/${node.id}/edit`}>
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
                        `Are you sure you want to delete the Absence Type ${node.name} ?`
                      )
                    )
                      handleDeleteAbsenceType(node.id)
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
            <td colSpan={2}>
              <div className="flex flex-row justify-end">
                <Link href={`/absenceTypes/new`}>
                  <a className="inline-flex items-center border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                      Add New Absence Type
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
