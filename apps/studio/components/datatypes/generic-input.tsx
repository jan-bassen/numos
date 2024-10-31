'use client'

import AddressInput from '@/components/datatypes/inputs/address-input'
import BooleanInput from '@/components/datatypes/inputs/boolean-input'
import ColorInput from '@/components/datatypes/inputs/color-input'
import DatetimeInput from '@/components/datatypes/inputs/datetime-input'
import EnumInput from '@/components/datatypes/inputs/enum-input'
import LocationInput from '@/components/datatypes/inputs/location-input'
import NumberInput from '@/components/datatypes/inputs/number-input'
import StringInput from '@/components/datatypes/inputs/string-input'
import WeatherInput from '@/components/datatypes/inputs/weather-input'
import type { InputProps } from '@repo/ui/components/ui/input'
import type { TextareaProps } from '@repo/ui/components/ui/textarea'
import type { Direction, WeatherCode, LayerTree } from '@/types/database.types'
import type * as SelectPrimitives from '@repo/ui/components/ui/select'
import type {
  ChangeEvent,
  ComponentPropsWithoutRef,
  HTMLAttributes,
} from 'react'
import { ImageInput } from '@/components/datatypes/inputs/image-input'
import DirectionInput from '@/components/datatypes/inputs/direction-input'
import type { SelectOptions } from '@/types/nodes.types'
import type {
  Color,
  Location,
  RawSingleValue,
  ValueSettings,
  ValueType,
} from '@repo/engine/types/value-types'

export type GenericInputExtra<VT extends ValueType = ValueType> = {
  id?: string
  locked?: boolean
  className?: string
  onBlur?: (e: ChangeEvent<Element>) => void
  settings?: ValueSettings<VT>
  onValueChange?: (value: RawSingleValue | null) => void
  environment?: 'node' | 'form' | 'list'
  valid?: boolean
}

export type StringInputProps = Omit<TextareaProps, 'value'> &
  GenericInputExtra<'string'> & {
    value?: string | null
    datatype: 'string'
  }
export type NumberInputProps = Omit<InputProps, 'value'> &
  GenericInputExtra<'number'> & {
    value?: number | string | null
    datatype: 'number'
  }

export type AddressInputProps = Omit<InputProps, 'value'> &
  GenericInputExtra<'address'> & {
    value?: string | null
    datatype: 'address'
  }

export type BooleanInputProps = GenericInputExtra<'boolean'> & {
  value?: boolean | null
  onChange?: (value?: boolean | null) => void
  onCheckedChange?: (value?: boolean | null) => void
  datatype: 'boolean'
}

export type EnumInputProps = Omit<
  ComponentPropsWithoutRef<typeof SelectPrimitives.Select>,
  'value'
> &
  GenericInputExtra<'enum'> & {
    value?: string | null
    onChange?: (value: string | null) => void
    datatype: 'enum'
    staticoptions?: SelectOptions
    placeholder?: string
  }

export type ColorInputProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  'color' | 'onChange' | 'onChangeCapture'
> &
  GenericInputExtra<'color'> & {
    datatype: 'color'
    value?: Color
    onChange?: (value: Color | null) => void
  }
export type DatetimeInputProps = GenericInputExtra<'datetime'> & {
  onChange?: (value: number | null) => void
  datatype: 'datetime'
  value?: number | null
}
export type LocationInputProps = GenericInputExtra<'location'> & {
  datatype: 'location'
  value?: Location | null
  onChange?: (value: Location | null) => void
}
export type WeatherInputProps = GenericInputExtra<'weather'> & {
  datatype: 'weather'
  value?: WeatherCode | null
  onChange?: (value: WeatherCode | null) => void
}
export type ImageInputProps = GenericInputExtra<'image'> & {
  onChange?: (value: string | null) => void
  datatype: 'image'
  value?: string | null
  layertree?: LayerTree
}
export type DirectionInputProps = GenericInputExtra<'direction'> & {
  onChange?: (value: Direction | null) => void
  datatype: 'direction'
  value?: Direction | null
}

export type BufferInputProps = GenericInputExtra<'buffer'> & {
  onChange?: (value: Buffer | null) => void
  datatype: 'buffer'
  value?: Buffer | null
}

export type GenericProps = GenericInputExtra & {
  datatype: 'generic'
  onChange?: (value: any) => void
  value?: any
}

type InputPropsMap = {
  string: StringInputProps
  number: NumberInputProps
  address: AddressInputProps
  boolean: BooleanInputProps
  enum: EnumInputProps
  color: ColorInputProps
  datetime: DatetimeInputProps
  location: LocationInputProps
  weather: WeatherInputProps
  image: ImageInputProps
  direction: DirectionInputProps
  buffer: BufferInputProps
  generic: GenericProps
}

export type GenericInputProps<
  K extends keyof InputPropsMap = keyof InputPropsMap,
> = InputPropsMap[K]

/* export type GenericInputProps =
  | NumberInputProps
  | AddressInputProps
  | BooleanInputProps
  | StringInputProps
  | EnumInputProps
  | ColorInputProps
  | DatetimeInputProps
  | LocationInputProps
  | WeatherInputProps
  | ImageInputProps
  | DirectionInputProps
  | BufferInputProps
  | GenericProps */

export default function GenericInput(props: GenericInputProps) {
  switch (props.datatype) {
    case 'number':
      return <NumberInput {...props} />
    case 'string':
      return <StringInput {...props} />
    case 'boolean':
      return <BooleanInput {...props} />
    case 'address':
      return <AddressInput {...props} />
    case 'enum':
      return <EnumInput {...props} />
    case 'color':
      return <ColorInput {...props} />
    case 'datetime':
      return <DatetimeInput {...props} />
    case 'location':
      return <LocationInput {...props} />
    case 'weather':
      return <WeatherInput {...props} />
    case 'image':
      return <ImageInput {...props} />
    case 'direction':
      return <DirectionInput {...props} />
    default:
      console.error('GenericInput: Unhandled type')
      return null
  }
}

export function GenericInput2(props: GenericInputProps) {
  switch (props.datatype) {
    case 'number':
      return NumberInput
    case 'string':
      return StringInput
    case 'boolean':
      return BooleanInput
    case 'address':
      return AddressInput
    case 'enum':
      return EnumInput
    case 'color':
      return ColorInput
    case 'datetime':
      return DatetimeInput
    case 'location':
      return LocationInput
    case 'weather':
      return WeatherInput
    case 'image':
      return ImageInput
    case 'direction':
      return DirectionInput
    default:
      console.error('GenericInput: Unhandled type')
      return null
  }
}
