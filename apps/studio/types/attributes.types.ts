import type { ValueSettings, ValueType } from '@repo/engine/types/value-types'
import type { Database } from './database-generated.types'

export type AttributeInfo = {
  description?: string
  display: Database['public']['Enums']['display']
  id: string
  list: boolean
  name?: string
  settings?: ValueSettings
  slug: string
  token_specific: boolean
  type: ValueType
}
