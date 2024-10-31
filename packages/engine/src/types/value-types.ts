// ----------- BASETYPES -------------

import type { Direction } from '@repo/engine/datatypes/directions'
import type { WeatherCode } from '@repo/engine/datatypes/weather-codes'

export type Color = { r: number; g: number; b: number; a: number }
export type Location = { lat: number; lng: number }

// ----------- VALUES -------------

export type RawSingleValue =
  | string
  | number
  | boolean
  | Color
  | Location
  | Direction
  | WeatherCode
  | Buffer

export type RawValue<
  format extends ValueFormat = ValueFormat,
  Optional extends boolean = false,
> = format extends 'single'
  ? Optional extends true
    ? OptionalValue<RawSingleValue>
    : RawSingleValue
  : format extends 'array'
    ? Optional extends true
      ? OptionalValue<RawSingleValue>[]
      : RawSingleValue[]
    : format extends 'objectarray'
      ? ObjectValue<RawSingleValue, Optional>[]
      : Optional extends true
        ?
            | OptionalValue<RawSingleValue>
            | OptionalValue<RawSingleValue>[]
            | ObjectValue<RawSingleValue, true>[]
        :
            | RawSingleValue
            | RawSingleValue[]
            | ObjectValue<RawSingleValue, false>[]

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

interface DataTypesMap<
  Format extends 'single' | 'array' | 'objectarray' | undefined = undefined,
  Optional extends boolean = false,
> {
  enum: ValueInterface<'enum', string, Format, Optional>
  number: ValueInterface<'number', number, Format, Optional>
  string: ValueInterface<'string', string, Format, Optional>
  boolean: ValueInterface<'boolean', boolean, Format, Optional>
  address: ValueInterface<'address', string, Format, Optional>
  color: ValueInterface<'color', Color, Format, Optional>
  datetime: ValueInterface<'datetime', number, Format, Optional>
  location: ValueInterface<'location', Location, Format, Optional>
  weather: ValueInterface<'weather', WeatherCode, Format, Optional>
  image: ValueInterface<'image', string, Format, Optional>
  direction: ValueInterface<'direction', Direction, Format, Optional>
  buffer: ValueInterface<'buffer', Buffer, Format, Optional>
  // Add new types here as needed
}

interface OptionalDataTypesMap<
  Format extends 'single' | 'array' | 'objectarray' | undefined = undefined,
  Optional extends boolean = false,
> extends DataTypesMap {
  generic: ValueInterface<'generic', RawSingleValue, Format, Optional>
}

export type ValueType = keyof DataTypesMap
export type OptionalValueType = keyof OptionalDataTypesMap

export type DataType = ValueType | 'exec'
export type OptionalDataType = OptionalValueType | 'exec'

export type ValueFormat = 'single' | 'array' | 'objectarray'

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

export type SelectOption = {
  value: string
  label: string
}

export type BaseSettings = {
  default?: RawSingleValue | Array<RawSingleValue>
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
  options?: SelectOption[]
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
