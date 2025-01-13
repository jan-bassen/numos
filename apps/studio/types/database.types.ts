import type { ZodType } from 'zod'

import type { MergeDeep } from 'type-fest'
import type { Database as DatabaseGenerated } from './database-generated.types'
import type {
  Value,
  ValueFormat,
  ValueMap,
  ValueSettings,
  ValueType,
  ValueTypeLiteral,
} from '@repo/shared/types/values'
import type {
  OLDSavedControlMap,
  OLDSavedInputMap,
  OLDSavedOutputMap,
  SavedNodeState,
} from '@repo/shared/types/graph-types'
import type { JSX } from 'react'
import type { ValidationIssueData } from '@repo/shared/types/validation-types'
import type { LayerDefinition } from '@/lib/schemas/layers/layer-schema'
import type { FullValue } from '@repo/shared/schemas/datatypes/datatype-schema'
import type { ActionTrigger } from '@/lib/schemas/actions/action-schema'

// Type overrides for specific columns:
export type Database = MergeDeep<
  DatabaseGenerated,
  {
    public: {
      Tables: {
        actions: {
          Row: {
            trigger: ActionTrigger | null
          }
          Insert: {
            trigger?: ActionTrigger | null
          }
          Update: {
            trigger?: ActionTrigger | null
          }
        }
        attributes: {
          Row: {
            type: ValueTypeLiteral
            settings: ValueSettings | null
            value: FullValue
          }
          Insert: {
            type: ValueTypeLiteral
            settings?: ValueSettings | null
            value: FullValue
          }
          Update: {
            type?: ValueTypeLiteral
            settings?: ValueSettings | null
            value?: FullValue | null
          }
        }
        image_layers: {
          Row: {
            definition: LayerDefinition
          }
          Insert: {
            definition?: LayerDefinition | null
          }
          Update: {
            definition?: LayerDefinition | null
          }
        }
        action_nodes: {
          Row: {
            state: SavedNodeState | null
            inputs: OLDSavedInputMap | null
            outputs: OLDSavedOutputMap
            controls: OLDSavedControlMap
          }
          Insert: {
            state?: SavedNodeState | null
            inputs?: OLDSavedInputMap | null
            outputs?: OLDSavedOutputMap
            controls?: OLDSavedControlMap
          }
          Update: {
            state?: SavedNodeState | null
            inputs?: OLDSavedInputMap | null
            outputs?: OLDSavedOutputMap
            controls?: OLDSavedControlMap
          }
        }
        image_nodes: {
          Row: {
            state: SavedNodeState | null
            inputs: OLDSavedInputMap | null
            outputs: OLDSavedOutputMap
            controls: OLDSavedControlMap
          }
          Insert: {
            state?: SavedNodeState | null
            inputs?: OLDSavedInputMap | null
            outputs?: OLDSavedOutputMap
            controls?: OLDSavedControlMap
          }
          Update: {
            state?: SavedNodeState | null
            inputs?: OLDSavedInputMap | null
            outputs?: OLDSavedOutputMap
            controls?: OLDSavedControlMap
          }
        }
        action_issues: {
          Row: {
            data: ValidationIssueData
          }
          Insert: {
            data: ValidationIssueData
          }
          Update: {
            data: ValidationIssueData
          }
        }
      }
    }
  }
>

export type DataType = Enums<'datatype'>

export type SocketType = DataType | 'generic'
export type ValueDataType = Exclude<DataType, 'exec'> | 'generic'
export type ValueSocketType = ValueDataType | 'generic'

export type Required = Enums<'required'>

export type Direction = Enums<'direction'>
export type WeatherCode = Enums<'weather-code'>
export type Display = Enums<'display'>
export type VersionStatus = Enums<'version-status'>
export type TriggerType = Enums<'trigger'>
export type IntervalUnit = Enums<'interval-unit'>
export type ImageType = Enums<'image-type'>

export type Collection = Tables<'collections'>
export type InsertCollection = TablesInsert<'collections'>
export type UpdateCollection = TablesUpdate<'collections'>
export type Attribute = Tables<'attributes'>
export type InsertAttribute = TablesInsert<'attributes'>
export type UpdateAttribute = TablesUpdate<'attributes'>
export type Action = Tables<'actions'>
export type InsertAction = TablesInsert<'actions'>
export type UpdateAction = TablesUpdate<'actions'>
export type Version = Tables<'versions'>
export type InsertVersion = TablesInsert<'versions'>
export type UpdateVersion = TablesUpdate<'versions'>
export type NewVersion = Omit<InsertVersion, 'collection_id'> | undefined
export type ImageNode = Tables<'image_nodes'>
export type InsertImageNode = TablesInsert<'image_nodes'>
export type UpdateImageNode = TablesUpdate<'image_nodes'>
export type ImageConnection = Tables<'image_connections'>
export type InsertImageConnection = TablesInsert<'image_connections'>
export type UpdateImageConnection = TablesUpdate<'image_connections'>
export type ActionNode = Tables<'action_nodes'>
export type InsertActionNode = TablesInsert<'action_nodes'>
export type UpdateActionNode = TablesUpdate<'action_nodes'>
export type ActionConnection = Tables<'action_connections'>
export type InsertActionConnection = TablesInsert<'action_connections'>
export type UpdateActionConnection = TablesUpdate<'action_connections'>
export type ActionIssue = Tables<'action_issues'>
export type InsertActionIssue = TablesInsert<'action_issues'>
export type UpdateActionIssue = TablesUpdate<'action_issues'>

export type Layer = Tables<'image_layers'>
export type InsertLayer = TablesInsert<'image_layers'>
export type UnorderedInsertLayer = Omit<InsertLayer, 'index'>
export type UpdateLayer = TablesUpdate<'image_layers'>

export type Upload = Tables<'layers'>
export type InsertUpload = TablesInsert<'layers'>
export type UpdateUpload = TablesUpdate<'layers'>

export type Folder = Tables<'folders'>
export type InsertFolder = TablesInsert<'folders'>
export type UpdateFolder = TablesUpdate<'folders'>

export type ResolvedUpload = Upload & {
  signedUrl: string
}

export type ResolvedFolder = Folder & {
  path: string[]
  subfolders: string[]
  layers: string[]
}

export type UploadsTree = {
  folders: Record<string, ResolvedFolder>
  layers: Record<string, ResolvedUpload>
}

export type LegacyResolvedUploads = Upload & {
  globalIndex: number
  signedUrl: string
}

export type LegacyResolvedFolder = Folder & {
  globalIndex: number
  path: string
  subfolders: LegacyResolvedFolder[]
  layers: LegacyResolvedUploads[]
}

export type LegacyUploadsTree = {
  folders: LegacyResolvedFolder[]
  layers: LegacyResolvedUploads[]
}

export type EmptyFolder = Tables<'empty_folders'>
export type InsertEmptyFolder = TablesInsert<'empty_folders'>

export type Profile = Tables<'profiles'>
export type InsertProfile = TablesInsert<'profiles'>
export type UpdateProfile = TablesUpdate<'profiles'>

export type UserData = {
  username: string
  name: string
  email?: string
  internal_avatar?: string
  external_avatar?: string
}

export type ImageGraph = {
  nodes: ImageNode[]
  connections: ImageConnection[]
}

export type ExtendedCollection = Omit<Collection, 'editable_version'> & {
  editable_version: Version
}

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

/*  type SimulatedTokenStateResult = {
  metadataChange: SimulatedStateChange
  stateChange: SimulatedStateChange
  logs: string[]
}
 */
export type SimulatedImageResult = {
  image: ArrayBuffer
  logs: string[]
}
export type SchemaMap = Record<string, ZodType>

export type NavItem = {
  name: string | null
  slug: string
  icon: JSX.Element
}

//TODO: Move all References to shared
export type ReturnInfo = {
  ok: boolean
  message: string | null
}

// Tokens

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

// Supabase shema extraction
type PublicSchema = Database[Extract<keyof Database, 'public'>]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
        PublicSchema['Views'])
    ? (PublicSchema['Tables'] &
        PublicSchema['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema['Enums']
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
    ? PublicSchema['Enums'][PublicEnumNameOrOptions]
    : never
