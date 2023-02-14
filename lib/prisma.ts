import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// Prisma middleware to sanitize date values
/*prisma.$use(async (params, next) => {
  let result = await next(params);

  if (_.isArray(result) || _.isObject(result))
    result = sanitizeDateValuesInObject(result);

  return result;
});*/

/**
 *
 * @param result any object
 * @returns object
 * This function remove problematic time component from date only values. It converts Date object to YYYY-MM-DD.
 * example of @db.Date column result 1995-05-17T00:00:00.000Z
 */
/*function sanitizeDateValuesInObject(result: any): any {
  if (_.isArray(result))
    return result.map((r) => sanitizeDateValuesInObject(r));
  if (!_.isObject(result)) return result;
  result = flatten(result);
  result = _.mapValues(result, (value, key) => {
    if (
      value instanceof Date &&
      value.toISOString().endsWith("T00:00:00.000Z")
    ) {
      return formatISO(value, { representation: "date" });
    }
    return value;
  });
  result = unflatten(result);
  return result;
}*/
