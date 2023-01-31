// /graphql/types/Link.ts
import { prisma } from '../../lib/prisma'
import { builder } from '../builder'

builder.prismaObject('Team', {
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
    members: t.relation('members'),
    membersCount: t.relationCount('members', {}),
    manager: t.relation('manager'),
    managerId: t.exposeString('managerId'),
  }),
})

builder.queryField('teams', (t) =>
  t.prismaConnection({
    type: 'Team',
    cursor: 'id',
    args: {
      id: t.arg.string(),
    },
    resolve: async (query, _parent, args, _ctx, _info) => {
      const { id } = args

      const teams = id 
        ? await prisma.team.findMany({ ...query, where: { id } })
        : await prisma.team.findMany({ ...query })

        return teams
    },
  })
)

builder.mutationField('createTeam', (t) =>
  t.prismaField({
    type: 'Team',
    args: {
      name: t.arg.string({ required: true }),
      managerId: t.arg.string({ required: true }),
    },
    resolve: async (query, _parent, args, ctx) => {
      const { name, managerId } = args

      //if (!(await ctx).user) {
      //  throw new Error("You have to be logged in to perform this action")
      //}

      const team = await prisma.team.findUnique({
        where: {
          name,
        },
      })

      if (team) {
        throw Error(`Error! Role with name ${name} already exist.`)
      }

      const manager = await prisma.user.findUnique({
        where: {
          id: managerId,
        },
      })

      if (!manager) {
        throw Error(`Error! Manager not found.`)
      }

      return await prisma.team.create({
        ...query,
        data: {
          name,
          managerId,
        },
      })
    },
  })
)

builder.mutationField('updateTeam', (t) =>
  t.prismaField({
    type: 'Team',
    args: {
      id: t.arg.string({ required: true }),
      name: t.arg.string({ required: true }),
      managerId: t.arg.string({ required: true }),
    },
    resolve: async (query, _parent, args, ctx) => {
      const { id, name, managerId } = args

      if (!id) {
        throw Error('Error! Id not informed')
      }

      const team = await prisma.team.findUnique({
        where: {
          id,
        },
      })

      if (!team) {
        throw Error(`Error! Team does not exist anymore.`)
      }

      if (team.name != name) {
        const teamWithName = await prisma.team.findUnique({
          where: {
            name,
          },
        })
        if (teamWithName) {
          throw Error(`Error! Team with name ${name} already exist.`)
        }
      }

      return await prisma.team.update({
        where: {
          id,
        },
        data: {
          name,
          managerId,
        },
      })
    },
  })
)

builder.mutationField('deleteTeam', (t) =>
  t.prismaField({
    type: 'Team',
    args: {
      id: t.arg.string({ required: true }),
    },
    resolve: async (query, _parent, args, ctx) => {
      const { id } = args
      console.log('id')
      console.log(id)

      if (!id) {
        throw Error('Error! Id not informed')
      }
      const team = await prisma.team.findUnique({
        where: {
          id,
        },
      })

      if (!team) {
        throw Error(`Error! Team not found`)
      }

      await prisma.team.delete({
        where: {
          id,
        },
      })

      return team
    },
  })
)
