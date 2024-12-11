import {
  getSettingsSchema,
  getSettingsValidation,
} from '@repo/engine/datatypes/settings-schemas'
import {
  PiEye02OffStroke,
  PiGlobeStroke,
  PiGridDashboardCircleStroke,
  PiIncognitoStroke,
  PiListDefaultStroke,
  PiSquareDotStroke,
  PiTokenStroke,
} from '@repo/ui/icons/pika'
import type { Attribute, DataType, SchemaMap } from '@/types/database.types'
import { z } from 'zod'
import type {
  RawValue,
  RawValueMap,
  ValueSettings,
  ValueType,
  ValueTypeMap,
} from '@repo/engine/types/value-types'
import type { TabOption } from '@/components/forms/tab-inputs/tab-option'
import { valueTypeKeys } from '@repo/engine/datatypes/constants/value-types'

export const displayOptions: TabOption[] = [
  {
    value: 'public',
    label: 'Public',
    subtext: 'Openly displayed',
    Icon: PiGlobeStroke,
  },
  {
    value: 'private',
    label: 'Private',
    subtext: 'Only known to you',
    Icon: PiIncognitoStroke,
  },
  {
    value: 'hidden',
    label: 'Shadowed',
    subtext: 'Public, not displayed',
    Icon: PiEye02OffStroke,
  },
]

//TODO: Implement Map instead of array above

export type AttributeDisplay = 'public' | 'hidden' | 'private'
export const attributeDisplayOptions: Record<AttributeDisplay, TabOption> = {
  public: {
    value: 'public',
    label: 'Public',
    subtext: 'Openly displayed',
    Icon: PiGlobeStroke,
  },
  private: {
    value: 'private',
    label: 'Private',
    subtext: 'Only known to you',
    Icon: PiIncognitoStroke,
  },
  hidden: {
    value: 'hidden',
    label: 'Shadowed',
    subtext: 'Public, not displayed',
    Icon: PiEye02OffStroke,
  },
}

export const scopeOptions: TabOption<boolean>[] = [
  {
    value: true,
    label: 'Token',
    subtext: 'Unique to every token',
    Icon: PiTokenStroke,
  },
  {
    value: false,
    label: 'Collection',
    subtext: 'Shared across tokens',
    Icon: PiGridDashboardCircleStroke,
  },
]

export type AttributeScope = 'token' | 'collection'
export const attributeScopeOptions: Record<
  AttributeScope,
  TabOption<boolean>
> = {
  token: {
    value: true,
    label: 'Token',
    subtext: 'Unique to every token',
    Icon: PiTokenStroke,
  },
  collection: {
    value: false,
    label: 'Collection',
    subtext: 'Shared across tokens',
    Icon: PiGridDashboardCircleStroke,
  },
}

export const listOptionMap = {
  single: {
    value: false,
    label: 'Single',
    slug: 'single',
    subtext: 'Single value',
    Icon: PiSquareDotStroke,
  },
  list: {
    value: true,
    label: 'List',
    slug: 'list',
    subtext: 'Multiple values',
    Icon: PiListDefaultStroke,
  },
}

export const listOptions: TabOption<boolean>[] = Object.values(listOptionMap)

export const newAttributeSchema = z.object({
  type: z.enum(valueTypeKeys, {
    required_error: 'You need to select a data type',
  }),
  list: z
    .boolean({
      required_error:
        'Is is required, to set wether the attribute is a list or not',
    })
    .default(false),
  name: z
    .string()
    .min(2, {
      message: 'Name must be at least 2 characters.',
    })
    .max(40, {
      message: 'Name must be less than 40 characters.',
    })
    .optional(),
  slug: z
    .string({
      required_error:
        'We need a unique identifier to differentiate this attribute',
    })
    .max(40, {
      message: 'Identifier must be less than 40 characters.',
    })
    .regex(/^[a-zA-Z0-9-_]+$/, {
      message: 'Identifier must be alphanumeric, dashes, or underscores.',
    }),
  description: z
    .string()
    .max(300, {
      message: 'Description must be less than 300 characters.',
    })
    .optional(),
})

export const attributeSchema = (type: ValueType, list: boolean) =>
  z.object({
    name: z
      .string()
      .min(2, {
        message: 'Name must be at least 2 characters.',
      })
      .max(40, {
        message: 'Name must be less than 40 characters.',
      }),
    description: z
      .string()
      .max(300, {
        message: 'Description must be less than 300 characters.',
      })
      .optional(),
    badge: z.string().optional(),
    list: z.boolean(),
    display: z.enum(['public', 'hidden', 'private']),
    settings: getSettingsSchema(type, list ? 'objectarray' : 'single'),
  })

export function getSchemaFromAttributes(
  attributes: Attribute[],
  optional: boolean,
) {
  const schema: SchemaMap = {}
  for (const attribute of attributes) {
    const singleSchema = getSettingsValidation(
      attribute.type,
      attribute.list ? 'objectarray' : 'single',
      optional,
      attribute.settings as ValueSettings,
    )
    if (optional) schema[attribute.slug] = singleSchema.nullable().optional()
    else schema[attribute.slug] = singleSchema
  }
  return z.object(schema).optional()
}

export function getDefaultValuesFromAttributes(
  attributes: Attribute[],
  state?: RawValueMap,
) {
  const defaultValues = attributes.reduce(
    (acc, attribute) => {
      const value = state?.[attribute.slug]
      const settings = attribute.settings as ValueSettings | undefined
      if (value !== undefined && value !== null) {
        acc[attribute.slug] = value
      } else if (
        settings?.default?.value !== undefined &&
        settings.default?.value !== null
      ) {
        acc[attribute.slug] = settings.default.value
      }
      return acc
    },
    {} as Record<string, RawValue>,
  )
  return defaultValues
}

export const getAttributeTypes = (attributes: Attribute[]): ValueTypeMap => {
  return attributes.reduce((accumulator, attribute) => {
    accumulator[attribute.slug] = { type: attribute.type, list: attribute.list }
    return accumulator
  }, {} as ValueTypeMap)
}
