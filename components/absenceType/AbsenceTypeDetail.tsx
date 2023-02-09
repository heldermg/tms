import { AbsenceType } from '@prisma/client'
import Link from 'next/link'
import React from 'react'
import { Toaster } from 'react-hot-toast'

interface AbsenceTypeDetailProps {
  absenceType: AbsenceType
}

export const AbsenceTypeDetail = ({ absenceType }: AbsenceTypeDetailProps) => {
  const { id, name, description } = absenceType
  
  return (
    <div className="container mx-auto max-w-md py-12">
      <Toaster />
      <h1 className="text-3xl font-medium my-5 text-center">Detail Absence Type</h1>
      <div className="grid grid-cols-1 gap-y-6 shadow-lg p-8 rounded-lg">
        <label className="block">
          <span className="text-gray-700">Name</span>
          <input
            placeholder="Name"
            value={name}
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

        <div className="capitalize font-medium py-2 px-4 rounded-md">
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
        </div>
      </div>
    </div>
  )
}
