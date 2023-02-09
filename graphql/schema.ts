// graphql/schema.ts
import './types/Role'
import './types/Team'
import './types/User'
import './types/AbsenceType'
import './types/Absence'
import { builder } from './builder'

export const schema = builder.toSchema()
