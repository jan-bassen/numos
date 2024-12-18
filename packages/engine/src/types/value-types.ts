// ----------- BASETYPES -------------

import type { Direction } from '@repo/engine/datatypes/constants/directions'
import type { WeatherCode } from '@repo/engine/datatypes/constants/weather-codes'
import type { NumberRestrictions } from '@repo/engine/datatypes/schemas/datatype-schemas/number-schema'
import type { StringRestrictions } from '@repo/engine/datatypes/schemas/datatype-schemas/string-schema'
import type { EnumRestrictions } from '@repo/engine/datatypes/schemas/datatype-schemas/enum-schema'

export type Color = { r: number; g: number; b: number; a: number }
export type Location = { lat: number; lng: number }

// ----------- VALUES -------------

export type RawSingleValue<T extends ValueType = ValueType> =
  RawValueTypesMap[T]

export type RawValue<
  T extends ValueType = ValueType,
  format extends ValueFormat = ValueFormat,
  Optional extends boolean = false,
> = format extends 'single'
  ? Optional extends true
    ? OptionalValue<RawSingleValue<T>>
    : RawSingleValue<T>
  : format extends 'array'
    ? Optional extends true
      ? OptionalValue<RawSingleValue<T>>[]
      : RawSingleValue<T>[]
    : format extends 'objectarray'
      ? ObjectValue<RawSingleValue<T>, Optional>[]
      : Optional extends true
        ?
            | OptionalValue<RawSingleValue<T>>
            | OptionalValue<RawSingleValue<T>>[]
            | ObjectValue<RawSingleValue<T>, true>[]
        :
            | RawSingleValue<T>
            | RawSingleValue<T>[]
            | ObjectValue<RawSingleValue<T>, false>[]

export type OptionalValue<DTV extends RawSingleValue = RawSingleValue> =
  | DTV
  | undefined
  | null

export type ObjectValue<
  DTV extends RawSingleValue,
  Optional extends boolean = false,
> = {
  id: string
  value: Optional extends true ? OptionalValue<DTV> : DTV
}

export type ValueInterface<
  DT extends OptionalValueType,
  DTV extends RawSingleValue,
  Format extends 'single' | 'array' | 'objectarray' | undefined = undefined,
  Optional extends boolean = false,
> = Format extends 'single'
  ? {
      type: DT
      format: 'single'
      value: Optional extends true ? OptionalValue<DTV> : DTV
    }
  : Format extends 'array'
    ? {
        type: DT
        format: 'array'
        value: Optional extends true ? OptionalValue<DTV>[] : DTV[]
      }
    : Format extends 'objectarray'
      ? { type: DT; format: 'objectarray'; value: ObjectValue<DTV, Optional>[] }
      : never

export interface RawValueTypesMap {
  enum: string
  number: number
  string: string
  boolean: boolean
  address: string
  color: Color
  datetime: number
  location: Location
  weather: WeatherCode
  buffer: Buffer
  image: string
  direction: Direction
}

export interface DataTypesMap<
  Format extends 'single' | 'array' | 'objectarray' | undefined = undefined,
  Optional extends boolean = false,
> {
  enum: ValueInterface<'enum', RawValueTypesMap['enum'], Format, Optional>
  number: ValueInterface<'number', RawValueTypesMap['number'], Format, Optional>
  string: ValueInterface<'string', RawValueTypesMap['string'], Format, Optional>
  boolean: ValueInterface<
    'boolean',
    RawValueTypesMap['boolean'],
    Format,
    Optional
  >
  address: ValueInterface<
    'address',
    RawValueTypesMap['address'],
    Format,
    Optional
  >
  color: ValueInterface<'color', RawValueTypesMap['color'], Format, Optional>
  datetime: ValueInterface<
    'datetime',
    RawValueTypesMap['datetime'],
    Format,
    Optional
  >
  location: ValueInterface<
    'location',
    RawValueTypesMap['location'],
    Format,
    Optional
  >
  weather: ValueInterface<
    'weather',
    RawValueTypesMap['weather'],
    Format,
    Optional
  >
  image: ValueInterface<'image', RawValueTypesMap['image'], Format, Optional>
  direction: ValueInterface<
    'direction',
    RawValueTypesMap['direction'],
    Format,
    Optional
  >
  buffer: ValueInterface<'buffer', RawValueTypesMap['buffer'], Format, Optional>
  // Add new types here as needed
}

interface OptionalDataTypesMap<
  Format extends 'single' | 'array' | 'objectarray' | undefined = undefined,
  Optional extends boolean = false,
> extends DataTypesMap {
  generic: ValueInterface<'generic', RawSingleValue, Format, Optional>
}

export type ValueType = keyof DataTypesMap
export type ValueTypeLiteral = keyof RawValueTypesMap

export type OptionalValueType = keyof OptionalDataTypesMap

export type DataType = ValueType | 'exec'
export type OptionalDataType = OptionalValueType | 'exec'

export const valueFormats = ['single', 'array', 'objectarray'] as const
export type ValueFormat = (typeof valueFormats)[number]

export type Value<
  T extends ValueType = ValueType,
  Format extends ValueFormat = ValueFormat,
  Optional extends boolean = false,
> = T extends ValueType
  ? DataTypesMap<Format, Optional>[T]
  : DataTypesMap<Format, Optional>[keyof DataTypesMap]

export type ValueWithGeneric<
  T extends OptionalValueType = OptionalValueType,
  Format extends ValueFormat = ValueFormat,
  Optional extends boolean = false,
> = T extends OptionalValueType
  ? OptionalDataTypesMap<Format, Optional>[T]
  : OptionalDataTypesMap<Format, Optional>[keyof OptionalDataTypesMap]

export type ValueMap<
  Keys extends string = string,
  VT extends ValueType = ValueType,
  Format extends ValueFormat = ValueFormat,
  Optional extends boolean = false,
> = Record<Keys, Value<VT, Format, Optional>>

export type NodeValueMap = ValueMap<
  string,
  ValueType,
  'single' | 'objectarray',
  true
>

export type ValueWithGenericMap<
  Keys extends string = string,
  Format extends ValueFormat = ValueFormat,
  Optional extends boolean = false,
> = Record<Keys, ValueWithGeneric<OptionalValueType, Format, Optional>>

export type ValueTypeMap = Record<string, { type: ValueType; list: boolean }>
export type RawValueMap = Record<string, RawValue>

// ----------- SETTINGS -------------

export type BasicSelectOption = {
  id?: string
  value: string
  label: string
}

export type BaseSettings = {
  default?: Value<ValueType, 'single' | 'objectarray', true>
}
export type NumberSettings = {
  max?: number
  min?: number
  step?: number
} & BaseSettings

export type StringSettings = {
  max_length?: number
  min_length?: number
} & BaseSettings

export type EnumSettings = {
  options?: BasicSelectOption[]
  adaptOptions?: boolean
} & BaseSettings

export type GenericSettings = {
  type: Omit<DataType, 'enum' | 'string' | 'number'>
} & BaseSettings

export type ValueSettings<
  VT extends OptionalValueType | undefined = undefined,
> = VT extends undefined
  ? GenericSettings | EnumSettings | StringSettings | NumberSettings
  : VT extends 'generic'
    ? GenericSettings | EnumSettings | StringSettings | NumberSettings
    : VT extends 'enum'
      ? EnumSettings
      : VT extends 'string'
        ? StringSettings
        : VT extends 'number'
          ? NumberSettings
          : GenericSettings

// Value
export type FullValue<
  VT extends ValueType = ValueType,
  L extends boolean = boolean,
> = {
  type: VT
  list: L
  default?: Value<VT, L extends true ? 'objectarray' : 'single', true>
  restrictions?: ValueRestrictions<VT, L>
}

// biome-ignore lint/complexity/noBannedTypes: <explanation>
export type SingleValueBaseRestrictions<VT extends ValueType = ValueType> = {}

// biome-ignore lint/complexity/noBannedTypes: <explanation>
export type ListValueExtraRestrictions<VT extends ValueType = ValueType> = {}

export type BaseRestrictions<
  VT extends ValueType = ValueType,
  L extends boolean = boolean,
> = L extends true
  ? SingleValueBaseRestrictions<VT> & ListValueExtraRestrictions<VT>
  : SingleValueBaseRestrictions<VT>

export type ValueRestrictionsMap<L extends boolean = boolean> = {
  number: BaseRestrictions<'number', L> & NumberRestrictions
  string: BaseRestrictions<'string', L> & StringRestrictions
  enum: BaseRestrictions<'enum', L> & EnumRestrictions
  boolean: BaseRestrictions<'boolean', L>
  address: BaseRestrictions<'address', L>
  color: BaseRestrictions<'color', L>
  datetime: BaseRestrictions<'datetime', L>
  location: BaseRestrictions<'location', L>
  weather: BaseRestrictions<'weather', L>
  image: BaseRestrictions<'image', L>
  direction: BaseRestrictions<'direction', L>
  buffer: BaseRestrictions<'buffer', L>
}

export type ValueRestrictions<
  VT extends ValueType = ValueType,
  L extends boolean = boolean,
> = ValueRestrictionsMap<L>[VT]
