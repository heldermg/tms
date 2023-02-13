// graphql/builder.ts
import SchemaBuilder from '@pothos/core'
import PrismaPlugin from '@pothos/plugin-prisma'
import { prisma } from '../lib/prisma'
import type PrismaTypes from '@pothos/plugin-prisma/generated'
import RelayPlugin from '@pothos/plugin-relay'
import { DateTimeResolver, TimeResolver } from 'graphql-scalars'

export const builder = new SchemaBuilder<{
  Scalars: {
    Date: { Input: Date; Output: Date }
  }
  PrismaTypes: PrismaTypes
}>({
  plugins: [PrismaPlugin, RelayPlugin],
  relayOptions: {
    clientMutationId: 'omit',
    cursorType: 'String',
  },
  prisma: {
    client: prisma,
  },
})

builder.addScalarType("Date", DateTimeResolver, {})
//builder.addScalarType("Time", TimeResolver, {})

builder.queryType({
  fields: (t) => ({
    ok: t.boolean({
      resolve: () => true,
    }),
  }),
})

builder.mutationType({})
