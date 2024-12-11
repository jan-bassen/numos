'use client'

import type {
  ValueSettings,
  Value,
  ValueType,
} from '@repo/engine/types/value-types'
import { EnumInput } from './enum/enum-input'
import { ColorInput } from './color/color-input'
import { DatetimeInput } from './datetime/datetime-input'
import { LocationInput } from './location/location-input'
import { WeatherInput } from './weather/weather-input'
import { ImageInput } from './image/image-input'
import { DirectionInput } from './direction/direction-input'
import { StringInput } from './string/string-input'
import { NumberInput } from './number/number-input'
import { AddressInput } from './address/address-input'
import { BooleanInput } from './boolean/boolean-input'
import type { ChangeEvent } from 'react'
import type { LayerTree } from '@/types/database.types'

export type SingleDataTypeInputProps<T extends ValueType = ValueType> = {
  type: T
  value: Value<T, 'single', true>
  onChange: (value: Value<T, 'single', true>) => void
  onBlur?: (e: ChangeEvent<Element>) => void
  settings?: ValueSettings<T>
  className?: string
  placeholder?: string
  locked?: boolean
  environment?: 'node' | 'form' | 'list'
  valid?: boolean
  layertree?: T extends 'image' ? LayerTree : never
  id?: string
}

const inputsMap = {
  string: StringInput,
  number: NumberInput,
  address: AddressInput,
  boolean: BooleanInput,
  enum: EnumInput,
  color: ColorInput,
  datetime: DatetimeInput,
  location: LocationInput,
  weather: WeatherInput,
  image: ImageInput,
  direction: DirectionInput,
  buffer: () => null,
} as const

export function getDataTypeInput<T extends ValueType>(type: T) {
  if (!type || !inputsMap[type]) throw new Error('Invalid type for input')
  return inputsMap[type] as (
    props: SingleDataTypeInputProps<T>,
  ) => JSX.Element | null
}
