// /graphql/types/User.ts
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
    resolve: (query, _parent, _args, _ctx, _info) =>
      prisma.user.findMany({ ...query })
  })
)