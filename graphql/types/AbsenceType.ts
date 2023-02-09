// /graphql/types/AbsenceType.ts
import { GraphQLError } from 'graphql'
import { prisma } from '../../lib/prisma'
import { builder } from '../builder'

builder.prismaObject('AbsenceType', {
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
    description: t.exposeString('description'),
    absences: t.relation('absences'),
  }),
})

builder.queryField('absenceTypes', (t) =>
  t.prismaConnection({
    type: 'AbsenceType',
    cursor: 'id',
    args: {
      id: t.arg.string(),
    },
    resolve: async (query, _parent, args, _ctx, _info) => {
      const { id } = args

      const absenceType = id ?
        await prisma.absenceType.findMany({
            where: {
              id,
            },
          })
        : await prisma.absenceType.findMany({ ...query })

      return absenceType
    },
  })
)

builder.mutationField('createAbsenceType', (t) =>
  t.prismaField({
    type: 'AbsenceType',
    args: {
      name: t.arg.string({ required: true }),
      description: t.arg.string({ required: true }),
    },
    resolve: async (query, _parent, args, ctx) => {
      const { name, description } = args

      const absenceType = await prisma.absenceType.findUnique({
        where: {
          name,
        },
      })

      if (absenceType) {
        throw new GraphQLError(`Error! Absence Type with name ${name} already exist.`)
      }

      return await prisma.absenceType.create({
        ...query,
        data: {
          name,
          description,
        },
      })
    },
  })
)

builder.mutationField('updateAbsenceType', (t) =>
  t.prismaField({
    type: 'AbsenceType',
    args: {
      id: t.arg.string({ required: true }),
      name: t.arg.string({ required: true }),
      description: t.arg.string({ required: true }),
    },
    resolve: async (query, _parent, args, ctx) => {
      const { id, name, description } = args

      if (!id) {
        throw new GraphQLError('Error! Id not informed.')
      }

      const absenceType = await prisma.absenceType.findUnique({
        where: {
          id,
        },
      })

      if (!absenceType) {
        throw new GraphQLError(`Error! Absence Type does not exist.`)
      }

      if (absenceType.name != name) {
        const absenceTypeWithName = await prisma.absenceType.findUnique({
          where: {
            name,
          },
        })
        if (absenceTypeWithName) {
          throw new GraphQLError(`Error! Absence Type with name ${name} already exist.`)
        }
      }

      return await prisma.absenceType.update({
        where: {
          id,
        },
        data: {
          name,
          description,
        },
      })
    },
  })
)

builder.mutationField('deleteAbsenceType', (t) =>
  t.prismaField({
    type: 'AbsenceType',
    args: {
      id: t.arg.string({ required: true }),
    },
    resolve: async (query, _parent, args, ctx) => {
      const { id } = args

      if (!id) {
        throw new GraphQLError('Error! Id not informed.')
      }

      const absenceType = await prisma.absenceType.findUnique({
        where: {
          id,
        },
        include: {
          absences: {
            select: {
              id: true
            }
          }
        }
      })

      if (!absenceType) {
        throw new GraphQLError(`Error! Absence Type not found.`)
      }

      if (absenceType.absences && absenceType.absences.length > 0) {
        throw new GraphQLError(`Error! Absence Type is in use by some Absence.`)
      }

      await prisma.absenceType.delete({
        where: {
          id,
        },
      })

      return absenceType
    },
  })
)
