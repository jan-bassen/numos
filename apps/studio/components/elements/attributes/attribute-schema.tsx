import {
  getSettingsSchema,
  getSettingsValidation,
} from '@/components/datatypes/settings-schemas'
import type { TabSelectOption } from '@/components/forms/tab-select'
import type { TabToggleOption } from '@/components/forms/tab-toggle'
import {
  PiEye02OffStroke,
  PiGlobeStroke,
  PiGridDashboard01Stroke,
  PiGridDashboardCircleStroke,
  PiIncognitoStroke,
  PiListDefaultStroke,
  PiSquareDotStroke,
  PiTokenStroke,
} from '@/lib/icons'
import { dataTypeKeys } from '@/lib/supabase/constants/datatypes'
import type {
  Attribute,
  DataTypeMap,
  DataType,
  DataTypeValue,
  SchemaMap,
  DataTypeValueMap,
  ValueSettings,
} from '@/types/database.types'
import { z } from 'zod'

export const displayOptions: TabSelectOption[] = [
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
export const attributeDisplayOptions: Record<
  AttributeDisplay,
  TabSelectOption
> = {
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

export const scopeOptions: TabToggleOption[] = [
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
export const attributeScopeOptions: Record<AttributeScope, TabToggleOption> = {
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

export const listOptions: TabToggleOption[] = Object.values(listOptionMap)

export const newAttributeSchema = z.object({
  type: z.enum(dataTypeKeys, {
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

export const attributeSchema = (type: DataType, list: boolean) =>
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
    token_specific: z.boolean(),
    display: z.enum(['public', 'hidden', 'private']),
    settings: getSettingsSchema(type, list),
  })

export function getSchemaFromAttributes(
  attributes: Attribute[],
  options?: { optional?: boolean; asObjectArray?: boolean },
) {
  const schema: SchemaMap = {}
  for (const attribute of attributes) {
    const singleSchema = getSettingsValidation(
      attribute.type,
      attribute.list,
      attribute.settings as ValueSettings,
      options,
    )
    if (options?.optional)
      schema[attribute.slug] = singleSchema.nullable().optional()
    else schema[attribute.slug] = singleSchema
  }
  return z.object(schema)
}

export function getSchemaFromAttribute(
  attribute: Attribute,
  options?: { optional?: boolean; inForm?: boolean },
) {
  const optional = options?.optional || false
  const inForm = options?.inForm || false
  return getSettingsValidation(
    attribute.type,
    attribute.list,
    attribute.settings as ValueSettings,
    options,
  )
}

export function getDefaultValuesFromAttributes(
  attributes: Attribute[],
  state?: DataTypeValueMap,
) {
  const defaultValues = attributes.reduce(
    (acc, attribute) => {
      const value = state?.[attribute.slug]
      const settings = attribute.settings as ValueSettings | undefined
      if (value !== undefined && value !== null) {
        acc[attribute.slug] = value
      } else if (settings?.default !== undefined && settings.default !== null) {
        acc[attribute.slug] = settings.default
      }
      return acc
    },
    {} as Record<string, DataTypeValue | Array<DataTypeValue>>,
  )
  return defaultValues
}

export const getAttributeTypes = (attributes: Attribute[]): DataTypeMap => {
  return attributes.reduce((accumulator, attribute) => {
    if (attribute.type === 'exec') return accumulator
    accumulator[attribute.slug] = { type: attribute.type, list: attribute.list }
    return accumulator
  }, {} as DataTypeMap)
}
