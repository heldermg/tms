import { Team, User } from "@prisma/client"
import Link from "next/link"
import { Toaster } from "react-hot-toast"

interface TeamDetailProps {
  team: Team
  manager: User
  teamLoading: boolean
  managerLoading: boolean
  users?: User[]
}

export const TeamDetail = ({ team, teamLoading, manager, managerLoading, users }: TeamDetailProps) => {
  const { name, managerId } = team

  return (
    <div className="container mx-auto max-w-md py-12">
      <Toaster />
      <h1 className="text-3xl font-medium my-5 text-center">Detail Team</h1>
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
          <span className="text-gray-700">Manager</span>
          {managerLoading ? (
            <div>Loandig manager</div>
          ) : (
            <select
              required={false}
              value={managerId}
              disabled
              placeholder="Manager"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value={managerId}>
                {manager.name} - {manager.email}
              </option>
            </select>
          )}
        </label>
        <label className="block">
          <span className="text-gray-700">Members</span>
          {users?.map((node: User) => (
            <div key={node.id} className='text-gray-700 ml-2'>
              <label>
                <span>&nbsp;{node.name} - {node.email}</span>
              </label>
            </div>
          ))}
        </label>

        <div className="capitalize font-medium py-2 px-4 rounded-md">
          <Link href={`/teams/`}>
            <a className="w-full">
              <button
                disabled={teamLoading}
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