import { Role } from '@prisma/client';
import Link from 'next/link';
import React from 'react'
import SvgIcon from './icons/SvgIcon'

export const RoleList = ({ roles }: any) => {
  console.log(roles)

  return (
    <div className="flex flex-col justify-center items-center">
      <table className="shadow-lg bg-white table-auto">
        <caption className="px-6 py-3 font-bold text-2xl bg-gray-200">Role List</caption>
        <thead>
          <tr>
            <th scope="col" className="bg-blue-50 border text-left px-8 py-4">
              Name
            </th>
            <th scope="col" className="bg-blue-50 border text-left px-8 py-4">
              Acronym
            </th>
            <th scope="col" className="bg-blue-50 border text-left px-8 py-4">
              Description
            </th>
            <th scope="col" className="bg-blue-50 border text-center px-8 py-4">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {roles.edges.map(({ node }: { node: Role }) => (
            <tr key={node.id}>
              <td className="px-6 py-4">{node.name}</td>
              <td className="px-6 py-4">{node.acronym}</td>
              <td className="px-6 py-4">{node.description}</td>
              <td className="px-6 py-4">
                <Link href={`/roles/${node.id}`}>
                  <a className="inline-flex items-center border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0">
                    <SvgIcon 
                      iconType="magnifying-glass-plus"
                      title="Detail"
                      desc="Detail Button"
                      className="w-6 h-6"
                    />
                  </a>
                </Link>
                <Link href={`/roles/${node.id}/edit`}>
                  <a className="inline-flex items-center border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0">
                    <SvgIcon 
                      iconType="pencil-square"
                      title="Edit"
                      desc="Edit Button"
                      className="w-6 h-6"
                    />
                  </a>
                </Link>
                <Link href={`/roles/${node.id}/delete`}>
                  <a className="inline-flex items-center border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0">
                    <SvgIcon 
                      iconType="trash"
                      title="Delete"
                      desc="Delete Button"
                      className="w-6 h-6"
                    />
                  </a>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={4}>
              <div className="flex flex-row justify-end">
                <Link href={`/roles/new`}>
                  <a className="inline-flex items-center border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                      Add New Role
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
