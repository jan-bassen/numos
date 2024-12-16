import { z } from 'zod'
import { sharedInsertSchema, sharedUpdateSchema } from '@/lib/schemas/shared'
import { valueTypeKeys } from '@repo/engine/datatypes/constants/value-types'
import { fullDatatypeSchema } from '@repo/engine/datatypes/schemas/datatype-schema'
import type {
  ValueFormat,
  ValueMap,
  ValueType,
  ValueTypeMap,
} from '@repo/engine/types/value-types'
import type { SchemaMap } from '@/types/database.types'
import type { Attribute } from '@/types/database.types'
import { getRestrictionsValidation } from '@repo/engine/datatypes/settings-schemas'

//TODO: Delete token_specific, type, list & settings
const token_specific = z.boolean().default(true)
const settings = z.null().optional()
const list = z.boolean().default(false)
const type = z.enum(valueTypeKeys, {
  required_error: 'You need to select a data type',
})

export type Display = 'public' | 'hidden' | 'private'
const display = z.enum(['public', 'hidden', 'private']).default('public')

export const updateAttributeSchema = z.object({
  ...sharedUpdateSchema,
  display: display.optional(),
  value: fullDatatypeSchema.nullable().optional(),
  //------------
  token_specific: token_specific.optional(),
  list: list.optional(),
  type: type.optional(),
  settings,
})

export const newAttributeSchema = z.object({
  ...sharedInsertSchema,
  display: display.optional(),
  value: fullDatatypeSchema.nullable().optional(),
  //------------
  token_specific: token_specific.optional(),
  list: list,
  type: type,
  settings: settings.optional(),
})

export function getSchemaFromAttributes(
  attributes: Attribute[],
  optional: boolean,
) {
  const schema: SchemaMap = {}
  for (const attribute of attributes) {
    const singleSchema = getRestrictionsValidation(attribute.value, {
      optional,
      format: attribute.list ? 'objectarray' : 'single',
    })
    if (optional) schema[attribute.slug] = singleSchema.nullable().optional()
    else schema[attribute.slug] = singleSchema
  }
  return z.object(schema).optional()
}

export function getDefaultValuesFromAttributes(
  attributes: Attribute[],
  state?: ValueMap<string, ValueType, ValueFormat, true>,
) {
  const defaultValues = attributes.reduce(
    (acc, attribute) => {
      const value = state?.[attribute.slug]
      if (value !== undefined && value !== null) {
        acc[attribute.slug] = value
      } else if (
        attribute.value.default !== undefined &&
        attribute.value.default !== null
      ) {
        acc[attribute.slug] = attribute.value.default
      }
      return acc
    },
    {} as ValueMap<string, ValueType, ValueFormat, true>,
  )
  return defaultValues
}

export const getAttributeTypes = (attributes: Attribute[]): ValueTypeMap => {
  return attributes.reduce((accumulator, attribute) => {
    accumulator[attribute.slug] = { type: attribute.type, list: attribute.list }
    return accumulator
  }, {} as ValueTypeMap)
}

/* const settings = (type: ValueType, list: boolean) => {
  return getSettingsSchema(type, list ? 'objectarray' : 'single')
    .nullable()
    .optional()
} */

/* export const updateAttributeSchema = (
  typeValue: ValueType,
  listValue: boolean,
) =>
  z.object({
    token_specific: token_specific.optional(),
    list: list.optional(),
    type: type.optional(),
    display: display.optional(),
    settings: settings(typeValue, listValue),
    ...sharedUpdateSchema,
  })

export const attributeSchema: AttributeSchema = {
  root: updateAttributeSchema,
  token_specific,
  list,
  type,
  display,
  settings,
  ...sharedSchema,
} */
