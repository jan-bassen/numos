'use client'

import { locationSchema } from '@repo/shared/schemas/datatypes/datatype-schemas/location-schema'
import type { Location } from '@repo/shared/types/values'
import { buttonVariants } from '@repo/ui/components/button'
import { Input } from '@repo/ui/components/input'
import { Label } from '@repo/ui/components/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@repo/ui/components/popover'
import { cn } from '@repo/ui/lib/utils'
import { useRef } from 'react'
import { Drag } from 'rete-react-plugin'
import { toast } from 'sonner'
import type { SingleDataTypeInputProps } from '../single-datatype-input'

export function LocationInput({
  value,
  onChange,
  locked,
  className,
  environment,
  valid,
  ...props
}: SingleDataTypeInputProps<'location'>) {
  const dragRef = useRef<any>(null)
  Drag.useNoDrag(dragRef)

  let location: Location | null = null
  try {
    location = locationSchema.optional().nullable().parse(value.value) || null
  } catch {
    toast.error('invalid location')
  }

  function update(part: Partial<Location>) {
    if (locked) return
    const next: Location = {
      lat: location?.lat ?? 0,
      lng: location?.lng ?? 0,
      ...part,
    }
    onChange?.({ value: next, type: 'location', format: 'single' })
  }

  const label = location
    ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`
    : 'Set Location'

  return (
    <Popover>
      <PopoverTrigger
        id={props.id}
        ref={environment === 'node' ? dragRef : undefined}
        disabled={locked}
        className={cn(
          buttonVariants({ variant: 'outline' }),
          '!line-clamp-1 h-10 w-full overflow-hidden text-ellipsis text-nowrap font-normal',
          environment === 'node' &&
            'h-7 min-w-36 max-w-52 items-center rounded-lg px-2 py-0 text-sm',
          valid === false
            ? environment === 'node'
              ? 'border-warning bg-warning/10'
              : 'border-destructive bg-destructive/10'
            : '',
          environment === 'simulation' &&
            'h-9 items-center rounded-lg py-1.5 text-sm',
          className,
        )}
      >
        {label}
      </PopoverTrigger>
      <PopoverContent
        side="top"
        sideOffset={6}
        className="m-1 w-64 space-y-2 rounded-lg p-3"
      >
        <div className="space-y-0.5">
          <Label
            htmlFor="location-lat"
            className="pl-0.5 text-muted-foreground text-sm"
          >
            Latitude
          </Label>
          <Input
            id="location-lat"
            type="number"
            min={-90}
            max={90}
            step="any"
            disabled={locked}
            value={location?.lat ?? ''}
            placeholder="0"
            onChange={(e) => update({ lat: Number(e.target.value) })}
          />
        </div>
        <div className="space-y-0.5">
          <Label
            htmlFor="location-lng"
            className="pl-0.5 text-muted-foreground text-sm"
          >
            Longitude
          </Label>
          <Input
            id="location-lng"
            type="number"
            min={-180}
            max={180}
            step="any"
            disabled={locked}
            value={location?.lng ?? ''}
            placeholder="0"
            onChange={(e) => update({ lng: Number(e.target.value) })}
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}
