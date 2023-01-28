// /graphql/types/Link.ts
import { prisma } from "../../lib/prisma";
import { builder } from "../builder";

builder.prismaObject('Role', {
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
    acronym: t.exposeString('acronym'),
    description: t.exposeString('description'),
    users: t.relation('users')
  }),
})

builder.queryField('roles', (t) =>  
  t.prismaConnection({
    type: 'Role',
    cursor: 'id',
    resolve: (query, _parent, _args, _ctx, _info) =>
      prisma.role.findMany({ ...query })
  })
)