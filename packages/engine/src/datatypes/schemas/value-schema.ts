import type { ValueTypeLiteral } from '@repo/engine/types/value-types'
import { z, type ZodType } from 'zod'

export function singleValueSchema<B extends ZodType>(
  type: ValueTypeLiteral,
  baseSchema: B,
) {
  return z.object({
    value: baseSchema.optional(),
    format: z.literal('single'),
    type: z.literal(type),
  })
}

export function arrayValueSchema<B extends ZodType>(
  type: ValueTypeLiteral,
  baseSchema: B,
) {
  return z.object({
    value: z.array(baseSchema).optional(),
    format: z.literal('array'),
    type: z.literal(type),
  })
}

export function objectArrayValueSchema<B extends ZodType>(
  type: ValueTypeLiteral,
  baseSchema: B,
) {
  return z.object({
    value: z
      .array(
        z.object({
          id: z.string(),
          value: baseSchema,
        }),
      )
      .optional(),
    format: z.literal('objectarray'),
    type: z.literal(type),
  })
}

export function valueSchemas<B extends ZodType>(
  type: ValueTypeLiteral,
  baseSchema: B,
) {
  return z.discriminatedUnion('format', [
    singleValueSchema(type, baseSchema),
    arrayValueSchema(type, baseSchema),
    objectArrayValueSchema(type, baseSchema),
  ])
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
