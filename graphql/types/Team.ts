// /graphql/types/Link.ts
import { prisma } from "../../lib/prisma";
import { builder } from "../builder";

builder.prismaObject('Team', {
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
    members: t.relation('members'),
    membersCount: t.relationCount('members', {}),
    manager: t.relation('manager'),
    managerId: t.exposeString('managerId')
  }),
})

builder.queryField('teams', (t) =>  
  t.prismaConnection({
    type: 'Team',
    cursor: 'id',
    resolve: async (query, _parent, _args, _ctx, _info) => {
      const teams = await prisma.team.findMany({ ...query })
      console.log(teams)
      
      return teams
    }
  })
)

builder.mutationField("createTeam", (t) =>
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
          name
        }
      })

      if (team) {
        throw Error(`Error! Role with name ${name} already exist.`)
      }

      const manager = await prisma.user.findUnique({
        where: {
          id: managerId
        }
      })

      if (!manager) {
        throw Error(`Error! Manager not found.`)
      }

      return await prisma.team.create({
        ...query,
        data: {
          name,
          managerId,
        }
      })
    }
  })
)