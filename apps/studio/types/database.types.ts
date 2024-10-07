import type { ZodType } from 'zod'
import {
  Inputs,
  NodeMap,
  type SavedControlMap,
  type SavedInputMap,
  type SavedOutputMap,
  type SelectOptions,
} from './nodes.types'

import type { MergeDeep } from 'type-fest'
import type { Database as DatabaseGenerated } from './database-generated.types'
import type { ActionTrigger } from '@/components/elements/actions/action-schema'
import { Option } from '@hubspot/api-client/lib/codegen/automation/actions'
import type { ValueSettings } from '@repo/engine/src/types/value-types'

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
            settings: ValueSettings | null
          }
          Insert: {
            settings?: ValueSettings | null
          }
          Update: {
            settings?: ValueSettings | null
          }
        }
        action_nodes: {
          Row: {
            inputs: SavedInputMap | null
            outputs?: SavedOutputMap
            controls?: SavedControlMap
          }
          Insert: {
            inputs?: SavedInputMap | null
            outputs?: SavedOutputMap | null
            controls?: SavedControlMap | null
          }
          Update: {
            inputs?: SavedInputMap | null
            outputs?: SavedOutputMap | null
            controls?: SavedControlMap | null
          }
        }
        image_nodes: {
          Row: {
            inputs: SavedInputMap | null
            outputs?: SavedOutputMap
            controls?: SavedControlMap
          }
          Insert: {
            inputs?: SavedInputMap | null
            outputs?: SavedOutputMap | null
            controls?: SavedControlMap | null
          }
          Update: {
            inputs?: SavedInputMap | null
            outputs?: SavedOutputMap | null
            controls?: SavedControlMap | null
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

export type Layer = Tables<'layers'>
export type InsertLayer = TablesInsert<'layers'>
export type UpdateLayer = TablesUpdate<'layers'>

export type Folder = Tables<'folders'>
export type InsertFolder = TablesInsert<'folders'>
export type UpdateFolder = TablesUpdate<'folders'>

export type ResolvedLayer = Layer & {
  signedUrl: string
}

export type ResolvedFolder = Folder & {
  path: string[]
  subfolders: string[]
  layers: string[]
}

export type LayerTree = {
  folders: Record<string, ResolvedFolder>
  layers: Record<string, ResolvedLayer>
}

export type LegacyResolvedLayer = Layer & {
  globalIndex: number
  signedUrl: string
}

export type LegacyResolvedFolder = Folder & {
  globalIndex: number
  path: string
  subfolders: LegacyResolvedFolder[]
  layers: LegacyResolvedLayer[]
}

export type LegacyLayerTree = {
  folders: LegacyResolvedFolder[]
  layers: LegacyResolvedLayer[]
}

export type EmptyFolder = Tables<'empty_folders'>
export type InsertEmptyFolder = TablesInsert<'empty_folders'>

export type Profile = Tables<'profiles'>
export type InsertProfile = TablesInsert<'profiles'>
export type UpdateProfile = TablesUpdate<'profiles'>

export type ImageGraph = {
  nodes: ImageNode[]
  connections: ImageConnection[]
}

export type ExtendedCollection = Omit<Collection, 'editable_version'> & {
  editable_version: Version
}

export type DatatypeObjectValue<
  DTV extends DataTypeValue,
  Optional extends boolean = false,
> = {
  id: string
  value: Optional extends true ? OptionalDataType<DTV> : DTV
}

export type OptionalDataType<DTV extends DataTypeValue = DataTypeValue> =
  | DTV
  | undefined
  | null

export type NotatedDataTypeValueInterface<
  DT extends DataType,
  DTV extends DataTypeValue,
  List extends boolean = false,
  Optional extends boolean = false,
  AsObjectArray extends boolean = false,
> = {
  type: DT
  list: List
  value: List extends true
    ? AsObjectArray extends false
      ? Optional extends true
        ? OptionalDataType<DTV>[]
        : DTV[]
      : DatatypeObjectValue<DTV, Optional>[]
    : Optional extends true
      ? OptionalDataType<DTV>
      : DTV
}

export type Color = { r: number; g: number; b: number; a: number }
export type Location = { lat: number; lng: number }

export type DataTypeValue<Optional extends boolean = false> =
  Optional extends true
    ?
        | string
        | number
        | boolean
        | Color
        | Location
        | Direction
        | WeatherCode
        | Buffer
        | undefined
        | null
    :
        | string
        | number
        | boolean
        | Color
        | Location
        | Direction
        | WeatherCode
        | Buffer

export type NotatedSingleStringValue<Optional extends boolean = false> =
  NotatedDataTypeValueInterface<'string', string, false, Optional, false>

export type NotatedListStringValue<
  Optional extends boolean = false,
  AsObjectArray extends boolean = false,
> = NotatedDataTypeValueInterface<
  'string',
  string,
  true,
  Optional,
  AsObjectArray
>

export type NotatedStringValue<
  Optional extends boolean = false,
  AsObjectArray extends boolean = false,
> =
  | NotatedSingleStringValue<Optional>
  | NotatedListStringValue<Optional, AsObjectArray>

export type NotatedSingleNumberValue<Optional extends boolean = false> =
  NotatedDataTypeValueInterface<'number', number, false, Optional, false>

export type NotatedListNumberValue<
  Optional extends boolean = false,
  AsObjectArray extends boolean = false,
> = NotatedDataTypeValueInterface<
  'number',
  number,
  true,
  Optional,
  AsObjectArray
>

export type NotatedNumberValue<
  Optional extends boolean = false,
  AsObjectArray extends boolean = false,
> =
  | NotatedSingleNumberValue<Optional>
  | NotatedListNumberValue<Optional, AsObjectArray>

export type NotatedSingleBooleanValue<Optional extends boolean = false> =
  NotatedDataTypeValueInterface<'boolean', boolean, false, Optional, false>

export type NotatedListBooleanValue<
  Optional extends boolean = false,
  AsObjectArray extends boolean = false,
> = NotatedDataTypeValueInterface<
  'boolean',
  boolean,
  true,
  Optional,
  AsObjectArray
>

export type NotatedBooleanValue<
  Optional extends boolean = false,
  AsObjectArray extends boolean = false,
> =
  | NotatedSingleBooleanValue<Optional>
  | NotatedListBooleanValue<Optional, AsObjectArray>

export type NotatedSingleColorValue<Optional extends boolean = false> =
  NotatedDataTypeValueInterface<'color', Color, false, Optional, false>

export type NotatedListColorValue<
  Optional extends boolean = false,
  AsObjectArray extends boolean = false,
> = NotatedDataTypeValueInterface<'color', Color, true, Optional, AsObjectArray>

export type NotatedColorValue<
  Optional extends boolean = false,
  AsObjectArray extends boolean = false,
> =
  | NotatedSingleColorValue<Optional>
  | NotatedListColorValue<Optional, AsObjectArray>

export type NotatedSingleLocationValue<Optional extends boolean = false> =
  NotatedDataTypeValueInterface<'location', Location, false, Optional, false>

export type NotatedListLocationValue<
  Optional extends boolean = false,
  AsObjectArray extends boolean = false,
> = NotatedDataTypeValueInterface<
  'location',
  Location,
  true,
  Optional,
  AsObjectArray
>

export type NotatedLocationValue<
  Optional extends boolean = false,
  AsObjectArray extends boolean = false,
> =
  | NotatedSingleLocationValue<Optional>
  | NotatedListLocationValue<Optional, AsObjectArray>

export type NotatedSingleDirectionValue<Optional extends boolean = false> =
  NotatedDataTypeValueInterface<'direction', Direction, false, Optional, false>

export type NotatedListDirectionValue<
  Optional extends boolean = false,
  AsObjectArray extends boolean = false,
> = NotatedDataTypeValueInterface<
  'direction',
  Direction,
  true,
  Optional,
  AsObjectArray
>

export type NotatedDirectionValue<
  Optional extends boolean = false,
  AsObjectArray extends boolean = false,
> =
  | NotatedSingleDirectionValue<Optional>
  | NotatedListDirectionValue<Optional, AsObjectArray>

export type NotatedSingleWeatherValue<Optional extends boolean = false> =
  NotatedDataTypeValueInterface<'weather', WeatherCode, false, Optional, false>

export type NotatedListWeatherValue<
  Optional extends boolean = false,
  AsObjectArray extends boolean = false,
> = NotatedDataTypeValueInterface<
  'weather',
  WeatherCode,
  true,
  Optional,
  AsObjectArray
>

export type NotatedWeatherValue<
  Optional extends boolean = false,
  AsObjectArray extends boolean = false,
> =
  | NotatedSingleWeatherValue<Optional>
  | NotatedListWeatherValue<Optional, AsObjectArray>

export type NotatedSingleAddressValue<Optional extends boolean = false> =
  NotatedDataTypeValueInterface<'address', string, false, Optional, false>

export type NotatedListAddressValue<
  Optional extends boolean = false,
  AsObjectArray extends boolean = false,
> = NotatedDataTypeValueInterface<
  'address',
  string,
  true,
  Optional,
  AsObjectArray
>

export type NotatedAddressValue<
  Optional extends boolean = false,
  AsObjectArray extends boolean = false,
> =
  | NotatedSingleAddressValue<Optional>
  | NotatedListAddressValue<Optional, AsObjectArray>

export type NotatedSingleImageValue<Optional extends boolean = false> =
  NotatedDataTypeValueInterface<'image', string, false, Optional, false>

export type NotatedListImageValue<
  Optional extends boolean = false,
  AsObjectArray extends boolean = false,
> = NotatedDataTypeValueInterface<
  'image',
  string,
  true,
  Optional,
  AsObjectArray
>

export type NotatedImageValue<
  Optional extends boolean = false,
  AsObjectArray extends boolean = false,
> =
  | NotatedSingleImageValue<Optional>
  | NotatedListImageValue<Optional, AsObjectArray>

export type NotatedSingleBufferValue<Optional extends boolean = false> =
  NotatedDataTypeValueInterface<'buffer', Buffer, false, Optional, false>

export type NotatedListBufferValue<
  Optional extends boolean = false,
  AsObjectArray extends boolean = false,
> = NotatedDataTypeValueInterface<
  'buffer',
  Buffer,
  true,
  Optional,
  AsObjectArray
>

export type NotatedBufferValue<
  Optional extends boolean = false,
  AsObjectArray extends boolean = false,
> =
  | NotatedSingleBufferValue<Optional>
  | NotatedListBufferValue<Optional, AsObjectArray>

export type NotatedSingleEnumValue<Optional extends boolean = false> =
  NotatedDataTypeValueInterface<'enum', string, false, Optional, false>

export type NotatedListEnumValue<
  Optional extends boolean = false,
  AsObjectArray extends boolean = false,
> = NotatedDataTypeValueInterface<'enum', string, true, Optional, AsObjectArray>

export type NotatedEnumValue<
  Optional extends boolean = false,
  AsObjectArray extends boolean = false,
> =
  | NotatedSingleEnumValue<Optional>
  | NotatedListEnumValue<Optional, AsObjectArray>

export type NotatedSingleDatetimeValue<Optional extends boolean = false> =
  NotatedDataTypeValueInterface<'datetime', number, false, Optional, false>

export type NotatedListDatetimeValue<
  Optional extends boolean = false,
  AsObjectArray extends boolean = false,
> = NotatedDataTypeValueInterface<
  'datetime',
  number,
  true,
  Optional,
  AsObjectArray
>

export type NotatedDatetimeValue<
  Optional extends boolean = false,
  AsObjectArray extends boolean = false,
> =
  | NotatedSingleDatetimeValue<Optional>
  | NotatedListDatetimeValue<Optional, AsObjectArray>

export type NotatedSingleGenericValue<Optional extends boolean = false> =
  NotatedDataTypeValueInterface<
    'generic',
    DataTypeValue,
    false,
    Optional,
    false
  >

export type NotatedListGenericValue<
  Optional extends boolean = false,
  AsObjectArray extends boolean = false,
> = NotatedDataTypeValueInterface<
  'generic',
  DataTypeValue,
  true,
  Optional,
  AsObjectArray
>

export type NotatedGenericValue<
  Optional extends boolean = false,
  AsObjectArray extends boolean = false,
> =
  | NotatedSingleGenericValue<Optional>
  | NotatedListGenericValue<Optional, AsObjectArray>

export type NotatedSingleDataTypeValue<Optional extends boolean = false> =
  | NotatedSingleStringValue<Optional>
  | NotatedSingleNumberValue<Optional>
  | NotatedSingleBooleanValue<Optional>
  | NotatedSingleColorValue<Optional>
  | NotatedSingleLocationValue<Optional>
  | NotatedSingleDirectionValue<Optional>
  | NotatedSingleWeatherValue<Optional>
  | NotatedSingleAddressValue<Optional>
  | NotatedSingleImageValue<Optional>
  | NotatedSingleBufferValue<Optional>
  | NotatedSingleEnumValue<Optional>
  | NotatedSingleDatetimeValue<Optional>
  | NotatedSingleGenericValue<Optional>

export type NotatedListDataTypeValue<
  Optional extends boolean = false,
  AsObjectArray extends boolean = false,
> =
  | NotatedListStringValue<Optional, AsObjectArray>
  | NotatedListNumberValue<Optional, AsObjectArray>
  | NotatedListBooleanValue<Optional, AsObjectArray>
  | NotatedListColorValue<Optional, AsObjectArray>
  | NotatedListLocationValue<Optional, AsObjectArray>
  | NotatedListDirectionValue<Optional, AsObjectArray>
  | NotatedListWeatherValue<Optional, AsObjectArray>
  | NotatedListAddressValue<Optional, AsObjectArray>
  | NotatedListImageValue<Optional, AsObjectArray>
  | NotatedListBufferValue<Optional, AsObjectArray>
  | NotatedListEnumValue<Optional, AsObjectArray>
  | NotatedListDatetimeValue<Optional, AsObjectArray>
  | NotatedListGenericValue<Optional, AsObjectArray>

export type NotatedDataTypeValue<
  Optional extends boolean = false,
  AsObjectArray extends boolean = false,
> =
  | NotatedStringValue<Optional, AsObjectArray>
  | NotatedNumberValue<Optional, AsObjectArray>
  | NotatedBooleanValue<Optional, AsObjectArray>
  | NotatedColorValue<Optional, AsObjectArray>
  | NotatedLocationValue<Optional, AsObjectArray>
  | NotatedDirectionValue<Optional, AsObjectArray>
  | NotatedWeatherValue<Optional, AsObjectArray>
  | NotatedAddressValue<Optional, AsObjectArray>
  | NotatedImageValue<Optional, AsObjectArray>
  | NotatedBufferValue<Optional, AsObjectArray>
  | NotatedEnumValue<Optional, AsObjectArray>
  | NotatedDatetimeValue<Optional, AsObjectArray>
  | NotatedGenericValue<Optional, AsObjectArray>

export type DataTypeDefinition = {
  title: string
  description?: string
  icons: {
    stroke: (props: JSX.IntrinsicElements['svg']) => JSX.Element
    fill: (props: JSX.IntrinsicElements['svg']) => JSX.Element
  }
  attribute: boolean
  parameter: boolean
}

/* export type AttributeSettings = {
  default?: DataTypeValue;
  min?: DataTypeValue;
  max?: DataTypeValue;
  options?: DataTypeValue[];
}; */

export type DataTypeMap = {
  [key: string]: { type: ValueDataType; list: boolean }
}

export type UnresolvedDataTypeValueMap<Optional extends boolean = false> =
  Record<
    string,
    DataTypeValue | Array<DatatypeObjectValue<DataTypeValue, Optional>>
  >

export type DataTypeValueMap = {
  [key: string]: DataTypeValue | Array<DataTypeValue>
}

export type NotatedDataTypeValueMap = Record<string, NotatedDataTypeValue>

export type SimulatedMetadataChange = {
  name?: SimulatedValueChange
  description?: SimulatedValueChange
}

export type SimulatedValueChange = {
  old: NotatedDataTypeValue
  new: NotatedDataTypeValue
  label?: string
}

export type SimulatedStateChange = Record<string, SimulatedValueChange>

export type SimulatedTokenStateResult = {
  metadataChange: SimulatedStateChange
  stateChange: SimulatedStateChange
  logs: string[]
}
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

export type ReturnInfo = {
  ok: boolean
  message: string | null
}

// Tokens

export type TokenState = {
  metadata: TokenMetadata
  attributes: NotatedDataTypeValueMap
}

export type OptionalTokenState = {
  metadata: OptionalTokenMetadata
  attributes: NotatedDataTypeValueMap
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
