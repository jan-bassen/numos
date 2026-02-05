import type { ZodType } from 'zod'
import type { JSX } from 'react'

// Import shared types
import type {
  Value,
  ValueFormat,
  ValueMap,
  ValueType,
} from '@repo/shared/types/values'

// Re-export all table types from Drizzle schema
export type {
  // Accounts
  Account,
  NewAccount,
  AccountMembership,
  NewAccountMembership,
  Profile,
  NewProfile,
  // Collections
  Collection,
  NewCollection,
  Version,
  NewVersion,
  // Attributes
  Attribute,
  NewAttribute,
  // Layers
  Layer,
  NewLayer,
  ImageNode,
  NewImageNode,
  ImageConnection,
  NewImageConnection,
  // Actions
  Action,
  NewAction,
  ActionNode,
  NewActionNode,
  ActionConnection,
  NewActionConnection,
  ActionIssue,
  NewActionIssue,
  // Uploads
  Folder,
  NewFolder,
  Upload,
  NewUpload,
} from '@/lib/db/schema'

// Import enum values for type extraction
import {
  datatypeEnum,
  displayEnum,
  versionStatusEnum,
  directionEnum,
  imageTypeEnum,
  intervalUnitEnum,
  requiredEnum,
} from '@/lib/db/schema'

// Create enum types from Drizzle enums (for database operations)
export type DbDataType = (typeof datatypeEnum.enumValues)[number]
export type Display = (typeof displayEnum.enumValues)[number]
export type VersionStatus = (typeof versionStatusEnum.enumValues)[number]
export type Direction = (typeof directionEnum.enumValues)[number]
export type ImageType = (typeof imageTypeEnum.enumValues)[number]
export type IntervalUnit = (typeof intervalUnitEnum.enumValues)[number]
export type Required = (typeof requiredEnum.enumValues)[number]

// Import WeatherCode from shared (source of truth)
export type { WeatherCode } from '@repo/shared/constants/weather-codes'

// Import DataType and related types from shared package (for runtime/editor)
// These include additional types like 'direction', 'image', 'buffer' that aren't in the DB enum
export type {
  DataType,
  OptionalDataType,
  ValueType,
  OptionalValueType,
} from '@repo/shared/types/values'

// Socket types (for the node editor, includes all runtime types)
export type SocketType = import('@repo/shared/types/values').OptionalDataType | 'generic'
export type ValueDataType = Exclude<import('@repo/shared/types/values').DataType, 'exec'> | 'generic'
export type ValueSocketType = ValueDataType | 'generic'

// Trigger types
export type TriggerType = 'api' | 'time' | 'token'

// Import table types for use in composite types
import type {
  Collection,
  Version,
  ImageNode,
  ImageConnection,
} from '@/lib/db/schema'

// Update types (Partial of the table types)
export type UpdateCollection = Partial<Collection>
export type UpdateAttribute = Partial<import('@/lib/db/schema').Attribute>
export type UpdateAction = Partial<import('@/lib/db/schema').Action>
export type UpdateVersion = Partial<Version>
export type UpdateImageNode = Partial<ImageNode>
export type UpdateImageConnection = Partial<ImageConnection>
export type UpdateActionNode = Partial<import('@/lib/db/schema').ActionNode>
export type UpdateActionConnection = Partial<import('@/lib/db/schema').ActionConnection>
export type UpdateActionIssue = Partial<import('@/lib/db/schema').ActionIssue>
export type UpdateLayer = Partial<import('@/lib/db/schema').Layer>
export type UpdateUpload = Partial<import('@/lib/db/schema').Upload>
export type UpdateFolder = Partial<import('@/lib/db/schema').Folder>

// Insert types (alias for New* types)
export type InsertCollection = import('@/lib/db/schema').NewCollection
export type InsertAttribute = import('@/lib/db/schema').NewAttribute
export type InsertAction = import('@/lib/db/schema').NewAction
export type InsertVersion = import('@/lib/db/schema').NewVersion
export type InsertImageNode = import('@/lib/db/schema').NewImageNode
export type InsertImageConnection = import('@/lib/db/schema').NewImageConnection
export type InsertActionNode = import('@/lib/db/schema').NewActionNode
export type InsertActionConnection = import('@/lib/db/schema').NewActionConnection
export type InsertActionIssue = import('@/lib/db/schema').NewActionIssue
export type InsertLayer = import('@/lib/db/schema').NewLayer
export type InsertUpload = import('@/lib/db/schema').NewUpload
export type InsertFolder = import('@/lib/db/schema').NewFolder

// Derived insert types
export type PartialNewVersion = Omit<InsertVersion, 'collection'> | undefined
export type UnorderedInsertLayer = Omit<InsertLayer, 'index'>

// Extended collection type (with version relationship)
export type ExtendedCollection = Omit<Collection, 'editableVersion'> & {
  editableVersion: Version
}

// Image graph type
export type ImageGraph = {
  nodes: ImageNode[]
  connections: ImageConnection[]
}

// User data type (for profile display)
export type UserData = {
  username: string
  name: string
  email?: string
  internal_avatar?: string
  external_avatar?: string
}

// Value type definition (for UI)
export type ValueTypeDefinition = {
  title: string
  description?: string
  icons: {
    stroke: (props: JSX.IntrinsicElements['svg']) => JSX.Element
    fill: (props: JSX.IntrinsicElements['svg']) => JSX.Element
  }
  attribute: boolean
  parameter: boolean
}

// Simulated changes types
export type SimulatedMetadataChange = {
  name?: SimulatedValueChange
  description?: SimulatedValueChange
}

export type SimulatedValueChange = {
  old: Value<ValueType, ValueFormat, true>
  new: Value<ValueType, ValueFormat, true>
  label?: string
}

export type SimulatedStateChange = Record<string, SimulatedValueChange>

export type SimulatedImageResult = {
  image: ArrayBuffer
  logs: string[]
}

// Schema map type
export type SchemaMap = Record<string, ZodType>

// Navigation item type
export type NavItem = {
  name: string | null
  slug: string
  icon: JSX.Element
}

// Return info type (for API responses)
export type ReturnInfo = {
  ok: boolean
  message: string | null
}

// Token types
export type TokenState = {
  metadata: TokenMetadata
  attributes: ValueMap
}

export type OptionalTokenState = {
  metadata: OptionalTokenMetadata
  attributes: ValueMap
}

export type TokenMetadata = {
  id: number
  name: string
  description: string
}

export type OptionalTokenMetadata = {
  id?: number | null
  name?: string | null
  description?: string | null
}

// Legacy upload types (for backward compatibility with nested folder structure)
// These are used in components that haven't migrated to the new flat structure
import type { Upload, Folder } from '@/lib/db/schema'

export type LegacyResolvedUploads = Upload & {
  globalIndex: number
  signedUrl: string
}

export type LegacyResolvedFolder = Folder & {
  globalIndex: number
  path: string
  subfolders: LegacyResolvedFolder[]
  uploads: LegacyResolvedUploads[]
}

export type LegacyUploadsTree = {
  folders: LegacyResolvedFolder[]
  uploads: LegacyResolvedUploads[]
}
