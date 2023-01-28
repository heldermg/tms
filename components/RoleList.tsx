import { Role } from '@prisma/client';
import Link from 'next/link';
import React from 'react';
import SvgIcon from './Layout/SvgIcon';

export const RoleList = ({ roles }: any) => {
  console.log(roles);

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Acronym
              </th>
              <th scope="col" className="px-6 py-3">
                Description
              </th>
              <th scope="col" className="px-6 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {roles.edges.map(({ node }: { node: Role }) => (
              <tr
                key={node.id}
                className="bg-white border-b dark:bg-gray-900 dark:border-gray-700"
              >
                <td className="px-6 py-4">{node.name}</td>
                <td className="px-6 py-4">{node.acronym}</td>
                <td className="px-6 py-4">{node.description}</td>
                <td className="px-6 py-4">
                  <Link href={`/roles/${node.id}/edit`}>
                    <a className="inline-flex items-center border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0">
                      <SvgIcon className="w-6 h-6" iconType="pencil-square" />
                    </a>
                  </Link>
                  <Link href={`/roles/${node.id}`}>
                    <a className="inline-flex items-center border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0">
                      <SvgIcon className="w-6 h-6" iconType="magnifying-glass-plus" />
                    </a>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
