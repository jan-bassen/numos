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
import type {
  Color,
  DataTypeValue,
  Direction,
  Location,
  WeatherCode,
  LayerTree,
} from '@/types/database.types'
import type * as SelectPrimitives from '@repo/ui/components/ui/select'
import type {
  ChangeEvent,
  ComponentPropsWithoutRef,
  HTMLAttributes,
} from 'react'
import { ImageInput } from '@/components/datatypes/inputs/image-input'
import DirectionInput from '@/components/datatypes/inputs/direction-input'
import type { SelectOptions } from '@/types/nodes.types'
import type { ValueSettings } from '@repo/engine/src/types/value-types'

export type GenericInputExtra = {
  id?: string
  locked?: boolean
  className?: string
  onBlur?: (e: ChangeEvent<Element>) => void
  settings?: ValueSettings
  onValueChange?: (value: DataTypeValue | null) => void
  environment?: 'node' | 'form' | 'list'
  valid?: boolean
}

export type StringInputProps = Omit<TextareaProps, 'value'> &
  GenericInputExtra & {
    value?: string | null
    datatype: 'string'
  }
export type NumberInputProps = Omit<InputProps, 'value'> &
  GenericInputExtra & {
    value?: number | string | null
    datatype: 'number'
  }

export type AddressInputProps = Omit<InputProps, 'value'> &
  GenericInputExtra & {
    value?: string | null
    datatype: 'address'
  }

export type BooleanInputProps = GenericInputExtra & {
  value?: boolean | null
  onChange?: (value?: boolean | null) => void
  onCheckedChange?: (value?: boolean | null) => void
  datatype: 'boolean'
}

export type EnumInputProps = Omit<
  ComponentPropsWithoutRef<typeof SelectPrimitives.Select>,
  'value'
> &
  GenericInputExtra & {
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
  GenericInputExtra & {
    datatype: 'color'
    value?: Color
    onChange?: (value: Color | null) => void
  }
export type DatetimeInputProps = GenericInputExtra & {
  onChange?: (value: number | null) => void
  datatype: 'datetime'
  value?: number | null
}
export type LocationInputProps = GenericInputExtra & {
  datatype: 'location'
  value?: Location | null
  onChange?: (value: Location | null) => void
}
export type WeatherInputProps = GenericInputExtra & {
  datatype: 'weather'
  value?: WeatherCode | null
  onChange?: (value: WeatherCode | null) => void
}
export type ImageInputProps = GenericInputExtra & {
  onChange?: (value: string | null) => void
  datatype: 'image'
  value?: string | null
  layertree?: LayerTree
}
export type DirectionInputProps = GenericInputExtra & {
  onChange?: (value: Direction | null) => void
  datatype: 'direction'
  value?: Direction | null
}

export type BufferInputProps = GenericInputExtra & {
  onChange?: (value: Buffer | null) => void
  datatype: 'buffer'
  value?: Buffer | null
}

export type GenericProps = GenericInputExtra & {
  datatype: 'generic'
  onChange?: (value: any) => void
  value?: any
}

export type GenericInputProps =
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
  | GenericProps

//TODO: Fix exec && buffer type
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
    case 'generic':
      return null
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
