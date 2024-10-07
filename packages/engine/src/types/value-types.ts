// ----------- BASETYPES -------------

import type { Direction } from '../datatypes/directions.ts'
import type { WeatherCode } from '../datatypes/weather-codes.ts'

export type Color = { r: number; g: number; b: number; a: number }
export type Location = { lat: number; lng: number }

// ----------- VALUES -------------

export type RawValue =
  | string
  | number
  | boolean
  | Color
  | Location
  | Direction
  | WeatherCode
  | Buffer

export type OptionalValue<DTV extends RawValue = RawValue> =
  | DTV
  | undefined
  | null

export type ObjectValue<
  DTV extends RawValue,
  Optional extends boolean = false,
> = {
  id: string
  value: Optional extends true ? OptionalValue<DTV> : DTV
}

export type ValueInterface<
  DT extends DataType,
  DTV extends RawValue,
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
      : {
          type: DT
          format: undefined
          value: 'single' | 'array' | 'objectarray'
        }

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
  generic: ValueInterface<'generic', RawValue, Format, Optional>
  // Add new types here as needed
}

export type ValueType = keyof DataTypesMap
export type DataType = ValueType | 'exec'

export type ValueFormat = 'single' | 'array' | 'objectarray'

export type Value<
  T extends ValueType | undefined = undefined,
  Format extends ValueFormat | undefined = undefined,
  Optional extends boolean = false,
> = T extends ValueType
  ? DataTypesMap<Format, Optional>[T]
  : DataTypesMap<Format, Optional>[keyof DataTypesMap]

export type ValueMap<
  Keys extends string = string,
  Format extends ValueFormat | undefined = undefined,
  Optional extends boolean = false,
> = Record<Keys, Value<ValueType, Format, Optional>>

// ----------- SETTINGS -------------

export type SelectOption = {
  value: string
  label: string
}

export type BaseSettings = {
  default?: RawValue | Array<RawValue>
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

export type ValueSettings<DT extends DataType = DataType> =
  | NumberSettings
  | StringSettings
  | EnumSettings
  | GenericSettings
