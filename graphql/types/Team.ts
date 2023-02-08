// /graphql/types/Link.ts
import { GraphQLError } from 'graphql'
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
      users: t.arg.stringList(),
    },
    resolve: async (query, _parent, args, ctx) => {
      const { name, managerId, users } = args

      const team = await prisma.team.findUnique({
        where: {
          name,
        },
      })

      if (team) {
        throw new GraphQLError(`Error! Role with name ${name} already exist.`)
      }

      const manager = await prisma.user.findUnique({
        where: {
          id: managerId,
        },
      })

      if (!manager) {
        throw new GraphQLError(`Error! Manager not found.`)
      }

      let usersDb: any = []
      if (users) {
        for (let userId of users) {
          const u = await prisma.user.findUnique({
            where: {
              id: userId
            }
          })
          if (!u) {
            throw new GraphQLError(`User with id ${userId} does not exist!`)
          }
          usersDb.push({ id: u.id })
        }
        usersDb = usersDb.filter((u: any) => u.id != manager.id)
      }

      const teamCreated = await prisma.team.create({
        ...query,
        data: {
          name,
          managerId,
          members: {
            connect: usersDb ? usersDb : undefined
          }
        },
      })

      await prisma.user.update({
        where: {
          id: manager.id
        },
        data: {
          teamId: teamCreated.id
        }
      })

      console.log('##### users');
        console.log(users);
      if (users) {
        
        
        await prisma.user.updateMany({
          where: {
            id: {
              in: users
            }
          },
          data: {
            teamId: teamCreated.id
          }
        })
      }

      return teamCreated
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
      users: t.arg.stringList(),
    },
    resolve: async (query, _parent, args, ctx) => {
      const { id, name, managerId, users } = args

      if (!id) {
        throw new GraphQLError('Error! Id not informed')
      }

      const team = await prisma.team.findUnique({
        where: {
          id,
        },
        include: {
          members: {
            select: {
              id: true,
            },
          }
        }
      })

      if (!team) {
        throw new GraphQLError(`Error! Team does not exist anymore.`)
      }

      if (team.name != name) {
        const teamWithName = await prisma.team.findUnique({
          where: {
            name,
          },
        })
        if (teamWithName) {
          throw new GraphQLError(`Error! Team with name ${name} already exist.`)
        }
      }

      const manager = await prisma.user.findUnique({
        where: {
          id: managerId,
        },
      })

      if (!manager) {
        throw new GraphQLError(`Error! Manger dos not exist anymore.`)
      }

      await prisma.user.update({
        where: {
          id: team.managerId
        },
        data: {
          teamId: null
        }
      })

      await prisma.user.update({
        where: {
          id: manager.id
        },
        data: {
          teamId: team.id
        }
      })

      let usersToConnect: any = []
      if (users) {
        for (let userId of users) {
          const u = await prisma.user.findUnique({
            where: {
              id: userId
            }
          })
          if (!u) {
            throw new GraphQLError(`User with id ${userId} does not exist!`)
          }
          usersToConnect.push({ id: u.id })
        }
      }

      const usersToDisconnect = team.members
        .filter(m => usersToConnect.length > 0 && !usersToConnect.find((a: any) => a.id == m.id))

      return await prisma.team.update({
        where: {
          id,
        },
        data: {
          name,
          managerId,
          members: {
            connect: usersToConnect,
            disconnect: usersToDisconnect
          }
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

      if (!id) {
        throw new GraphQLError('Error! Id not informed')
      }
      const team = await prisma.team.findUnique({
        where: {
          id,
        },
      })

      if (!team) {
        throw new GraphQLError(`Error! Team not found`)
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
