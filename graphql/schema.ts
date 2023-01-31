// graphql/schema.ts
import './types/Role'
import './types/Team'
import './types/User'
import { builder } from './builder'

export const schema = builder.toSchema()
