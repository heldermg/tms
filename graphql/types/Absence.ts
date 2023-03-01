// @ts-nocheck
// /graphql/types/Absence.ts
import { GraphQLError } from 'graphql'
import { prisma } from '../../lib/prisma'
import { builder } from '../builder'
import { render } from "@react-email/render"
import AbsenceEmailTemplate from "../../components/email/AbsenceEmailTemplate"
import { sendEmail } from "../../lib/email"

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
        const absenceById = await prisma.absence.findMany({
          where: {
            id,
          },
        })

        console.log('absences');
        console.log(absenceById);

        return absenceById
      }

       const absences = await prisma.absence.findMany({
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

      return absences
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
      const newStartTimeAt = startTimeAt ? new Date(Date.parse(startTimeAt.toUTCString()) - startTimeAt.getTimezoneOffset() * 60000) : null
      const newEndTimeAt = endTimeAt ? new Date(Date.parse(endTimeAt.toUTCString()) - endTimeAt.getTimezoneOffset() * 60000) : null

      const isAllDay: boolean = startTimeAt && endTimeAt ? false : true

      if (newStartDateAt > newEndDateAt) {
        throw new GraphQLError(`Error! Start Date cannot be after the End Date.`)
      }

      if (newStartTimeAt && newEndTimeAt && newStartTimeAt >= newEndTimeAt) {
        throw new GraphQLError(`Error! Start Time cannot be equal or after the End Time.`)
      }

      const absence = await prisma.absence.create({
        ...query,
        data: {
          title,
          description,
          startDateAt: newStartDateAt,
          endDateAt: newEndDateAt,
          startTimeAt: newStartTimeAt,
          endTimeAt: newEndTimeAt,
          isAllDay,
          userId,
          absenceTypeId,
        },
      })

      const team = await prisma.team.findFirst({
        where: {
          members: {
            some: {
              id: userId
            }
          }
        }
      })
      
      console.log('team')
      console.log(team)

      const manager = await prisma.user.findUnique({
        where: {
          id: team?.managerId
        }
      })

      console.log('manager')
      console.log(manager)

      const user = await prisma.user.findUnique({
        where: {
          id: userId
        }
      })

      const absenceType = await prisma.absenceType.findUnique({
        where: {
          id: absenceTypeId
        }
      })
    
      sendEmail({
        from: "tms-app@tms-app.com",
        to: manager?.email,
        subject: "[TMS] New Absence Record!",
        html: render(AbsenceEmailTemplate(absence, user, absenceType)),
      })

      return absence
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

      const newStartDateAt = startDateAt.getHours() == 0 ? new Date(Date.parse(startDateAt.toUTCString()) - startDateAt.getTimezoneOffset() * 60000) : startDateAt
      const newEndDateAt = endDateAt.getHours() == 0 ? new Date(Date.parse(endDateAt.toUTCString()) - endDateAt.getTimezoneOffset() * 60000) : endDateAt
      const newStartTimeAt = startTimeAt ? new Date(Date.parse(startTimeAt.toUTCString()) - startTimeAt.getTimezoneOffset() * 60000) : null
      const newEndTimeAt = endTimeAt ? new Date(Date.parse(endTimeAt.toUTCString()) - endTimeAt.getTimezoneOffset() * 60000) : null

      const isAllDay: boolean = startTimeAt && endTimeAt ? false : true

      if (newStartDateAt > newEndDateAt) {
        throw new GraphQLError(`Error! Start Date cannot be after the End Date.`)
      }

      if (newStartTimeAt && newEndTimeAt && newStartTimeAt >= newEndTimeAt) {
        throw new GraphQLError(`Error! Start Time cannot be equal or after the End Time.`)
      }

      return await prisma.absence.update({
        where: {
          id,
        },
        data: {
          title,
          description,
          startDateAt: newStartDateAt,
          endDateAt: newEndDateAt,
          startTimeAt: newStartTimeAt,
          endTimeAt: newEndTimeAt,
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
