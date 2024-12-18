'use client'

import type {
  ValueSettings,
  Value,
  ValueType,
  ValueRestrictions,
} from '@repo/engine/types/value-types'
import { EnumInput } from '@/components/datatypes/enum/enum-input'
import { ColorInput } from '@/components/datatypes/color/color-input'
import { DatetimeInput } from '@/components/datatypes/datetime/datetime-input'
import { LocationInput } from '@/components/datatypes/location/location-input'
import { WeatherInput } from '@/components/datatypes/weather/weather-input'
import { ImageInput } from '@/components/datatypes/image/image-input'
import { DirectionInput } from '@/components/datatypes/direction/direction-input'
import { StringInput } from '@/components/datatypes/string/string-input'
import { NumberInput } from '@/components/datatypes/number/number-input'
import { AddressInput } from '@/components/datatypes/address/address-input'
import { BooleanInput } from '@/components/datatypes/boolean/boolean-input'
import type { ChangeEvent, JSX } from 'react'
import type { LayerTree } from '@/types/database.types'

export type SingleDataTypeInputProps<T extends ValueType = ValueType> = {
  type: T
  value: Value<T, 'single', true>
  onChange: (value: Value<T, 'single', true>) => void
  onBlur?: (e: ChangeEvent<Element>) => void
  restrictions?: ValueRestrictions<T, false> | null
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
