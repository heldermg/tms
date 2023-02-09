// /graphql/types/AbsenceType.ts
import { GraphQLError } from 'graphql'
import { prisma } from '../../lib/prisma'
import { builder } from '../builder'

builder.prismaObject('Absence', {
  fields: (t) => ({
    id: t.exposeID('id'),
    title: t.exposeString('title'),
    description: t.exposeString('description'),
    isAllDay: t.exposeBoolean('isAllDay'),
    user: t.relation('user'),
    userId: t.exposeString('userId'),
    absenceType: t.relation('absenceType'),
    absenceTypeId: t.exposeString('absenceTypeId')
  }),
})

builder.queryField('absences', (t) =>
  t.prismaConnection({
    type: 'Absence',
    cursor: 'id',
    args: {
      id: t.arg.string(),
    },
    resolve: async (query, _parent, args, _ctx, _info) => {
      const { id } = args

      const absence = id ?
        await prisma.absence.findMany({
            where: {
              id,
            },
          })
        : await prisma.absence.findMany({ ...query })

      return absence
    },
  })
)
