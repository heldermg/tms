import { PrismaClient } from '@prisma/client'
import { roles } from '../data/roles'
import { teams } from '../data/team'
import { users } from '../data/users'
const prisma = new PrismaClient()

async function main() {
  await prisma.role.createMany({
    data: roles
  })

  await prisma.user.createMany({
    data: users,
  })

  await prisma.team.create({
    data: {
      ...teams[0],
      manager: {
        connectOrCreate: {
          where: {
            email: users[0].email,
          },
          create: users[0]
        },
      }
    },
  })
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })