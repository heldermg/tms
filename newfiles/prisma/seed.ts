import { PrismaClient } from '@prisma/client'
import { links } from '../data/links'
import { roles } from '../data/roles'
const prisma = new PrismaClient()

async function main() {
  await prisma.role.createMany({
    data: roles
  })

  /*await prisma.user.create({
    data: {
      name: "Helder Martins",
      email: "helder.gomes@serpro.gov.br",
      profile: "ADMIN",
    },
  })*/

  await prisma.team.create({
    data: {
      name: "DGTU4",
      manager: {
        create: {
          name: "Helder Martins",
          email: "helder.gomes@serpro.gov.br",
          profile: "ADMIN",
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