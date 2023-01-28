// /graphql/resolvers.ts
import { prisma } from '../lib/prisma'

export const resolvers = {
  Query: {
    roles: () => {
      return prisma.role.findMany()
    },
    teams: () => {
      return prisma.team.findMany()
    },
  },
}