'use client'

import ColorDisplay from './color/color-display'
import LocationDisplay from './location/location-display'
import AddressDisplay from './address/address-display'
import DateTimeDisplay from './datetime/datetime-display'
import WeatherDisplay from './weather/weather-display'
import DirectionDisplay from './direction/direction-display'
import ImageDisplay from './image/image-display'
import { cn } from '@repo/ui/lib/utils'
import { dataTypes } from '@/lib/constants/datatypes'
import { Button } from '@repo/ui/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@repo/ui/components/ui/popover'
import type {
  Value,
  ValueFormat,
  ValueType,
} from '@repo/engine/types/value-types'
import { isListFormat } from '@repo/engine/datatypes/utils'

export type GenericSingleDisplayProps = {
  value: Value<ValueType, 'single', true>
  className?: string
}

export function GenericSingleDisplay({
  value,
  ...props
}: GenericSingleDisplayProps) {
  switch (value.type) {
    case 'string':
      return <span className={props.className}>{value.value}</span>
    case 'number':
      return <span className={props.className}>{value.value}</span>
    case 'boolean':
      return (
        <span className={props.className}>
          {value.value ? 'True' : 'False'}
        </span>
      )
    case 'color':
      return <ColorDisplay value={value.value} {...props} />
    case 'location':
      return <LocationDisplay value={value.value} {...props} />
    case 'address':
      return <AddressDisplay value={value.value} {...props} />
    case 'enum':
      return <span className={props.className}>{value.value}</span>
    case 'datetime':
      return <DateTimeDisplay value={value.value} {...props} />
    case 'weather':
      return <WeatherDisplay value={value.value} {...props} />
    case 'direction':
      return <DirectionDisplay value={value.value} {...props} />
    case 'image':
      return <ImageDisplay value={value.value} {...props} />
    default:
      return <span className={props.className}>Unsupported type</span>
  }
}

export type GenericDisplayProps = {
  value: Value<ValueType, ValueFormat, true>
  className?: string
}

export function GenericDisplay({ value, ...props }: GenericDisplayProps) {
  if (isListFormat<ValueType, true>(value)) {
    const x = value.value
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant={'outline'} className="gap-2 font-normal">
            {dataTypes[value.type].icons.stroke({
              className: 'size-4',
            })}
            List ({value.value.length})
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-fit min-w-32 px-3 py-2">
          <ul className={cn('space-y-1', props.className)}>
            {value.value.map((v, index) => {
              if (!v) return null
              return (
                <li
                  key={v.toString() + index.toString()}
                  className="flex gap-2"
                >
                  <GenericSingleDisplay
                    value={
                      {
                        type: value.type,
                        format: 'single',
                        value: v,
                      } as Value<ValueType, 'single', true>
                    }
                  />
                </li>
              )
            })}
          </ul>
        </PopoverContent>
      </Popover>
    )
  }
  return <GenericSingleDisplay value={value} {...props} />
}
