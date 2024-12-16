import type { FullValue } from '@repo/engine/types/value-types'
import type { Database } from './database-generated.types'

export type AttributeInfo = {
  value: FullValue
  description?: string
  display: Database['public']['Enums']['display']
  id: string
  name?: string
  slug: string
  token_specific: boolean
}
