// /graphql/types/User.ts
import { prisma } from '../../lib/prisma'
import { builder } from '../builder'

builder.prismaObject('User', {
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
    email: t.exposeString('email'),
    image: t.exposeString('image', { nullable: true }),
    profile: t.expose('profile', { type: Profile }),
    roles: t.relation('roles'),
    teamsManaged: t.relation('teamsManaged'),
    team: t.relation('team'),
    teamId: t.exposeString('teamId', { nullable: true }),
  }),
})

const Profile = builder.enumType('Profile', {
  values: ['ADMIN', 'MANAGER', 'TEAM_MEMBER'] as const,
})

builder.queryField('users', (t) =>
  t.prismaConnection({
    type: 'User',
    cursor: 'id',
    args: {
      id: t.arg.string(),
      withoutTeam: t.arg.boolean(),
    },
    resolve: async (query, _parent, args, _ctx, _info) => {
      const { id, withoutTeam } = args

      let users
      if (id) {
        users = await prisma.user.findMany({ ...query, where: { id } })
      } else if (withoutTeam) {
        users = await prisma.user.findMany({
          ...query,
          where: {
            teamId: null,
          },
        })
      } else {
        users = await prisma.user.findMany({ ...query })
      }

      return users
    },
  })
)

builder.mutationField('deleteUser', (t) =>
  t.prismaField({
    type: 'User',
    args: {
      id: t.arg.string({ required: true }),
    },
    resolve: async (query, _parent, args, ctx) => {
      const { id } = args

      if (!id) {
        throw Error('Error! Id not informed')
      }
      const user = await prisma.user.findUnique({
        where: {
          id,
        },
        include: {
          team: true,
        },
      })

      if (!user) {
        throw Error(`Error! User not found`)
      }

      if (user.team) {
        throw Error(`Error! User is part of the team ${user.team.name}`)
      }

      await prisma.user.delete({
        where: {
          id,
        },
      })

      return user
    },
  })
)
