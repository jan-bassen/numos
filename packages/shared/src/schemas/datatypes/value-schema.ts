import type {
  ValueFormat,
  ValueType,
  ValueTypeLiteral,
} from '@repo/shared/types/values'
import { z, type ZodType } from 'zod'
import { datatypeSchemasMap } from './datatype-schema'

export function singleValueSchema<B extends ZodType>(
  type: ValueTypeLiteral,
  baseSchema: B,
  optional = true,
) {
  return z.object({
    value: optional ? baseSchema.optional() : baseSchema,
    format: z.literal('single'),
    type: z.literal(type),
  })
}

export function arrayValueSchema<B extends ZodType>(
  type: ValueTypeLiteral,
  baseSchema: B,
  optional = true,
) {
  return z.object({
    value: optional ? z.array(baseSchema).optional() : z.array(baseSchema),
    format: z.literal('array'),
    type: z.literal(type),
  })
}

export function arrayObjectValueSchema<B extends ZodType>(baseSchema: B) {
  return z.array(
    z.object({
      id: z.string(),
      value: baseSchema,
    }),
  )
}

export function objectArrayValueSchema<B extends ZodType>(
  type: ValueTypeLiteral,
  baseSchema: B,
  optional = true,
) {
  const valueBaseSchema = arrayObjectValueSchema<B>(baseSchema)
  return z.object({
    value: optional ? valueBaseSchema.optional() : valueBaseSchema,
    format: z.literal('objectarray'),
    type: z.literal(type),
  })
}

export function valueSchemas<B extends ZodType>(
  type: ValueTypeLiteral,
  baseSchema: B,
  optional = true,
) {
  return z.discriminatedUnion('format', [
    singleValueSchema(type, baseSchema, optional),
    arrayValueSchema(type, baseSchema, optional),
    objectArrayValueSchema(type, baseSchema, optional),
  ])
}

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

/* 
export function getValueSchema(
  type: ValueType,
  format: ValueFormat,
  baseSchema: ZodType,
) {
  switch (format) {
    case 'single':
      return z.object({
        value: baseSchema.nullable().optional(),
        format: z.literal('single'),
        type: z.literal(type),
      })
    case 'array':
      return z.object({
        value: z.array(baseSchema.nullable().optional()),
        format: z.literal('array'),
        type: z.literal(type),
      })
    case 'objectarray':
      return z.object({
        value: z.array(
          z.object({
            id: z.string().optional(),
            value: baseSchema.nullable().optional(),
          }),
        ),
        format: z.literal('objectarray'),
        type: z.literal(type),
      })
    default:
      throw new Error('Invalid format')
  }
} */

/* export function getValueSchemas(type: ValueType, baseSchema: ZodType) {
  return {
    single: z.object({
      value: baseSchema.nullable().optional(),
      format: z.literal('single'),
      type: z.literal(type),
    }),
    array: z.object({
      value: z.array(baseSchema.nullable().optional()),
      format: z.literal('array'),
      type: z.literal(type),
    }),
    objectarray: z.object({
      value: z.array(
        z.object({
          id: z.string().optional(),
          value: baseSchema.nullable().optional(),
        }),
      ),
      format: z.literal('objectarray'),
      type: z.literal(type),
    }),
  }
} */
