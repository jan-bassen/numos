'use client'

import { Tooltip, TooltipTrigger } from '@repo/ui/components/ui/tooltip'
import { cn } from '@/lib/utils'
import type { Location } from '@/types/database.types'
import { TooltipContent } from '@radix-ui/react-tooltip'
import { useState } from 'react'
import { fromLatLng } from 'react-geocode'
import { getAddressFromGeocoder } from '../utils'
import { Separator } from '@repo/ui/components/ui/separator'
import type { GenericDisplayProps } from '../generic-display'

export type LocationDisplayProps = Omit<GenericDisplayProps, 'value'> & {
  value: Location
}

export default function LocationDisplay({
  value,
  className,
}: LocationDisplayProps) {
  const [shortAddress, setShortAddress] = useState<string>('')
  const [longAddress, setLongAddress] = useState<string>('')
  fromLatLng(value.lat, value.lng).then(({ results }) => {
    const address = getAddressFromGeocoder(results, value)
    setShortAddress(address.short)
    setLongAddress(address.long)
  })
  return (
    <Tooltip>
      <TooltipTrigger
        className={cn(
          'grid h-8 w-full max-w-44 place-items-center rounded-lg border border-border shadow-sm',
          className,
        )}
      >
        <p className="line-clamp-1 px-1 h-fit w-full text-ellipsis">
          {shortAddress}
        </p>
      </TooltipTrigger>
      <TooltipContent className="z-60 space-y-1 rounded-md border border-border bg-background p-2">
        <p className="w-full text-center font-medium">{longAddress}</p>
        <Separator />
        <p className="w-full text-center text-xs text-muted-foreground">
          {value.lat.toFixed(8)}, {value.lng.toFixed(8)}
        </p>
      </TooltipContent>
    </Tooltip>
  )
}
