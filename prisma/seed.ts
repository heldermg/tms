import { PrismaClient } from '@prisma/client'
import { roles } from '../data/roles'
import { teams } from '../data/team'
import { users } from '../data/users'
const prisma = new PrismaClient()

async function main() {
  await prisma.role.createMany({
    data: roles
  })

  const managerRole = await prisma.role.findUnique({
    where: {
      acronym: 'Mgr'
    }
  })

  await prisma.user.createMany({
    data: users,
  })

  const userCreated = await prisma.user.findUnique({
    where: {
      email: 'helder.gomes@serpro.gov.br'
    }
  })

  const teamCreated = await prisma.team.create({
    data: {
      ...teams[0],
      manager: {
        connectOrCreate: {
          where: {
            id: userCreated!.id,
          },
          create: userCreated!
        },
      }
    },
  })

  await prisma.user.update({
    where: {
      id: userCreated!.id
    },
    data: {
      teamId: teamCreated.id,
      roles: {
        connect: {
          id: managerRole!.id
        }
      }
    }
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