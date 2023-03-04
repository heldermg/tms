// /graphql/types/Role.ts
import { GraphQLError } from 'graphql'
import { prisma } from '../../lib/prisma'
import { builder } from '../builder'

builder.prismaObject('Role', {
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
    acronym: t.exposeString('acronym'),
    description: t.exposeString('description'),
    users: t.relation('users'),
  }),
})

builder.queryField('roles', (t) =>
  t.prismaConnection({
    type: 'Role',
    cursor: 'id',
    args: {
      id: t.arg.string(),
    },
    resolve: async (query, _parent, args, _ctx, _info) => {
      const { id } = args

      const roles = id
        ? await prisma.role.findMany({
            where: {
              id,
            },
          })
        : await prisma.role.findMany({ ...query })

      return roles
    },
  })
)

builder.queryField('rolesWithAbsences', (t) =>
  t.prismaConnection({
    type: 'Role',
    cursor: 'id',
    resolve: async (query, _parent, args, _ctx, _info) => {

      const roles = await prisma.role.findMany({
        include: {
          users: {
            select: {
              id: true,
              teamId: true,
              absences: true,
            }
          }
        }
      })

      return roles
    },
  })
)

builder.mutationField('createRole', (t) =>
  t.prismaField({
    type: 'Role',
    args: {
      name: t.arg.string({ required: true }),
      acronym: t.arg.string({ required: true }),
      description: t.arg.string({ required: true }),
    },
    resolve: async (query, _parent, args, ctx) => {
      const { name, acronym, description } = args

      const role = await prisma.role.findUnique({
        where: {
          acronym,
        },
      })

      if (role) {
        throw new GraphQLError(`Error! Role with acronym ${acronym} already exist.`)
      }

      return await prisma.role.create({
        ...query,
        data: {
          name,
          acronym,
          description,
        },
      })
    },
  })
)

builder.mutationField('updateRole', (t) =>
  t.prismaField({
    type: 'Role',
    args: {
      id: t.arg.string({ required: true }),
      name: t.arg.string({ required: true }),
      acronym: t.arg.string({ required: true }),
      description: t.arg.string({ required: true }),
    },
    resolve: async (query, _parent, args, ctx) => {
      const { id, name, acronym, description } = args

      if (!id) {
        throw new GraphQLError('Error! Id not informed')
      }

      const role = await prisma.role.findUnique({
        where: {
          id,
        },
      })

      if (!role) {
        throw new GraphQLError(`Error! Role does not exist anymore.`)
      }

      if (role.acronym != acronym) {
        const roleWithAcronym = await prisma.role.findUnique({
          where: {
            acronym,
          },
        })
        if (roleWithAcronym) {
          throw new GraphQLError(`Error! Role with acronym ${acronym} already exist.`)
        }
      }

      return await prisma.role.update({
        where: {
          id,
        },
        data: {
          name,
          acronym,
          description,
        },
      })
    },
  })
)

builder.mutationField('deleteRole', (t) =>
  t.prismaField({
    type: 'Role',
    args: {
      id: t.arg.string({ required: true }),
    },
    resolve: async (query, _parent, args, ctx) => {
      const { id } = args

      if (!id) {
        throw new GraphQLError('Error! Id not informed')
      }

      const role = await prisma.role.findUnique({
        where: {
          id,
        },
        include: {
          users: {
            select: {
              id: true
            }
          }
        }
      })

      if (!role) {
        throw new GraphQLError(`Error! Role not found`)
      }

      if (role.users && role.users.length > 0) {
        throw new GraphQLError(`Error! Role is in use by some user`)
      }

      await prisma.role.delete({
        where: {
          id,
        },
      })

      return role
    },
  })
)
