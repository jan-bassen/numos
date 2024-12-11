import { z } from 'zod'
import { sharedUpdateSchema } from './shared'
import { valueTypeKeys } from '@repo/engine/datatypes/constants/value-types'
import { fullDatatypeSchema } from '@repo/engine/datatypes/schemas/datatype-schema'

//TODO: Delete token_specific, type, list & settings
const token_specific = z.boolean().default(true)
const settings = z.null()
const list = z.boolean().default(false)
const type = z.enum(valueTypeKeys, {
  required_error: 'You need to select a data type',
})

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
