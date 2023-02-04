import { Profile } from '@prisma/client'

export const users = [
  {
    name: 'Helder Martins',
    email: 'helder@martins.com',
    profile: Profile.ADMIN,
  },
  {
    name: 'Fulano de tal',
    email: 'fulano@fulano.com',
    profile: Profile.TEAM_MEMBER,
  },
]
