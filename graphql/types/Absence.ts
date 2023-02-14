// /graphql/types/Absence.ts
import { GraphQLError } from 'graphql'
import { prisma } from '../../lib/prisma'
import { builder } from '../builder'

builder.prismaObject('Absence', {
  fields: (t) => ({
    id: t.exposeID('id'),
    title: t.exposeString('title'),
    description: t.exposeString('description'),
    startDateAt: t.expose('startDateAt', { type: 'Date' }),
    endDateAt: t.expose('endDateAt', { type: 'Date' }),
    startTimeAt: t.expose('startTimeAt', { type: 'Time', nullable: true }),
    endTimeAt: t.expose('endTimeAt', { type: 'Time', nullable: true }),
    isAllDay: t.exposeBoolean('isAllDay'),
    user: t.relation('user'),
    userId: t.exposeString('userId'),
    absenceType: t.relation('absenceType'),
    absenceTypeId: t.exposeString('absenceTypeId'),
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

      if (id) {
        const absences = await prisma.absence.findMany({
          where: {
            id,
          },
        })

        return absences
      }

      return await prisma.absence.findMany({
        ...query,
        orderBy: [
          {
            startDateAt: 'desc',
          },
          {
            endDateAt: 'desc',
          }
        ]
      })
    },
  })
)

builder.mutationField('createAbsence', (t) =>
  t.prismaField({
    type: 'Absence',
    args: {
      title: t.arg.string({ required: true }),
      description: t.arg.string({ required: true }),
      startDateAt: t.arg({ type: 'Date', required: true }),
      endDateAt: t.arg({ type: 'Date', required: true }),
      startTimeAt: t.arg({ type: 'Date' }),
      endTimeAt: t.arg({ type: 'Date' }),
      userId: t.arg.string({ required: true }),
      absenceTypeId: t.arg.string({ required: true }),
    },
    resolve: async (query, _parent, args, ctx) => {
      const {
        title,
        description,
        startDateAt,
        endDateAt,
        startTimeAt,
        endTimeAt,
        userId,
        absenceTypeId,
      } = args

      const newStartDateAt = new Date(Date.parse(startDateAt.toUTCString()) - startDateAt.getTimezoneOffset() * 60000)
      const newEndDateAt = new Date(Date.parse(endDateAt.toUTCString()) - endDateAt.getTimezoneOffset() * 60000)

      const isAllDay: boolean = startTimeAt && endTimeAt ? false : true

      return await prisma.absence.create({
        ...query,
        data: {
          title,
          description,
          startDateAt: newStartDateAt,
          endDateAt: newEndDateAt,
          startTimeAt,
          endTimeAt,
          isAllDay,
          userId,
          absenceTypeId,
        },
      })
    },
  })
)

builder.mutationField('updateAbsence', (t) =>
  t.prismaField({
    type: 'Absence',
    args: {
      id: t.arg.string({ required: true }),
      title: t.arg.string({ required: true }),
      description: t.arg.string({ required: true }),
      startDateAt: t.arg({ type: 'Date', required: true }),
      endDateAt: t.arg({ type: 'Date', required: true }),
      startTimeAt: t.arg({ type: 'Date' }),
      endTimeAt: t.arg({ type: 'Date' }),
      userId: t.arg.string({ required: true }),
      absenceTypeId: t.arg.string({ required: true }),
    },
    resolve: async (query, _parent, args, ctx) => {
      const {
        id,
        title,
        description,
        startDateAt,
        endDateAt,
        startTimeAt,
        endTimeAt,
        userId,
        absenceTypeId,
      } = args

      const isAllDay: boolean = startTimeAt && endTimeAt ? false : true

      return await prisma.absence.update({
        where: {
          id,
        },
        data: {
          title,
          description,
          startDateAt,
          endDateAt,
          startTimeAt: startTimeAt ? startTimeAt : null,
          endTimeAt: endTimeAt ? endTimeAt : null,
          isAllDay,
          userId,
          absenceTypeId,
        },
      })
    },
  })
)

builder.mutationField('deleteAbsence', (t) =>
  t.prismaField({
    type: 'Absence',
    args: {
      id: t.arg.string({ required: true }),
    },
    resolve: async (query, _parent, args, ctx) => {
      const { id } = args

      if (!id) {
        throw new GraphQLError('Error! Id not informed.')
      }

      const absence = await prisma.absence.findUnique({
        where: {
          id,
        },
      })

      if (!absence) {
        throw new GraphQLError(`Error! Absence not found.`)
      }

      await prisma.absence.delete({
        where: {
          id,
        },
      })

      return absence
    },
  })
)