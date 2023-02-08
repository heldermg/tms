import { Role, User } from "@prisma/client"
import Link from "next/link"
import { Toaster } from "react-hot-toast"
import { UserProfile } from "./UserProfile"

interface UserDetailProps {
  user: User
  userLoading: boolean
  roles?: Role[]
}

export const UserDetail = ({ user, userLoading, roles }: UserDetailProps) => {
  const { id, name, email, profile, image } = user

  return (
    <div className="container mx-auto max-w-md py-12">
      <Toaster />
      <h1 className="text-3xl font-medium my-5 text-center">Detail User</h1>
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
          <span className="text-gray-700">Email</span>
          <input
            placeholder="Email"
            value={email}
            disabled
            name="email"
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </label>
        <label className="block">
          <span className="text-gray-700">Profile</span>
          <select
            value={profile}
            disabled
            placeholder="Profile"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            {Object.keys(UserProfile).map(p => (
              <option key={p} value={p}>{UserProfile[p as keyof typeof UserProfile]}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-gray-700">Roles</span>
          {roles?.map((node: Role) => (
            <div key={node.id} className='text-gray-700 ml-2'>
              <label>
                <span>&nbsp;{node.acronym} - {node.name}</span>
              </label>
            </div>
          ))}
        </label>

        <div className="capitalize font-medium py-2 px-4 rounded-md">
          <Link href={`/users/`}>
            <a className="w-full">
              <button
                disabled={userLoading}
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