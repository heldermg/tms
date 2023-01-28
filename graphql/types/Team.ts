// /graphql/types/Link.ts
import { prisma } from "../../lib/prisma";
import { builder } from "../builder";

builder.prismaObject('Team', {
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
    members: t.relation('members'),
    manager: t.relation('manager'),
    managerId: t.exposeString('managerId')
  }),
})

builder.queryField('teams', (t) =>  
  t.prismaConnection({
    type: 'Team',
    cursor: 'id',
    resolve: (query, _parent, _args, _ctx, _info) =>
      prisma.team.findMany({ ...query })
  })
)