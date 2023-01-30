// /graphql/types/User.ts
import { users } from "../../data/users";
import { prisma } from "../../lib/prisma";
import { builder } from "../builder";

builder.prismaObject('User', {
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
    email: t.exposeString('email'),
    image: t.exposeString('image', { nullable: true, }),
    profile: t.expose('profile', { type: Profile, }),
    roles: t.relation('roles'),
    teamsManaged: t.relation('teamsManaged'),
    team: t.relation('team'),
    teamId: t.exposeString('teamId', { nullable: true, }),

  })
})

const Profile = builder.enumType('Profile', {
  values: ['ADMIN', 'MANAGER', 'TEAM_MEMBER'] as const,
})

builder.queryField('users', (t) =>  
  t.prismaConnection({
    type: 'User',
    cursor: 'id',
    args: {
      withoutTeam: t.arg.boolean(),
    },
    resolve: async (query, _parent, args, _ctx, _info) => {
      const { withoutTeam } = args

      const users = withoutTeam ? 
        await prisma.user.findMany({ ...query,
          where: {
            teamId: null
          }
        }) : await prisma.user.findMany({ ...query})
      return users
    }
  })
)