import type { ValueFormat, ValueType } from '@repo/shared/types/values'
import { datatypeSchemasMap } from '@repo/shared/schemas/datatypes/datatype-schema'
import {
  arrayValueSchema,
  objectArrayValueSchema,
  singleValueSchema,
} from '@repo/shared/schemas/datatypes/value-schema'
import type { ZodType } from 'zod'

export function getDataTypeSchema(
  type: ValueType,
  format: ValueFormat,
  optional: boolean,
): ZodType {
  const baseSchema = datatypeSchemasMap[type]
  if (!baseSchema) {
    throw new Error(`No base schema found for type ${type}`)
  }
  switch (format) {
    case 'single':
      return singleValueSchema(type, baseSchema, optional)
    case 'array':
      return arrayValueSchema(type, baseSchema, optional)
    case 'objectarray':
      return objectArrayValueSchema(type, baseSchema, optional)
  }
}
