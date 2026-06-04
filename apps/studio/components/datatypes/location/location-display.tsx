'use client'

import type { Location, OptionalValue } from '@repo/shared/types/values'
import { Separator } from '@repo/ui/components/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@repo/ui/components/tooltip'
import { cn } from '@repo/ui/lib/utils'
import type { GenericDisplayProps } from '../generic-display'

export type LocationDisplayProps = Omit<GenericDisplayProps, 'value'> & {
  value: OptionalValue<Location>
}

export default function LocationDisplay({
  value,
  className,
}: LocationDisplayProps) {
  if (!value) return null
  const short = `${value.lat.toFixed(4)}, ${value.lng.toFixed(4)}`
  return (
    <Tooltip>
      <TooltipTrigger
        className={cn(
          'grid h-8 w-full max-w-44 place-items-center rounded-lg border border-border shadow-xs',
          className,
        )}
      >
        <p className="line-clamp-1 h-fit w-full text-ellipsis px-1">{short}</p>
      </TooltipTrigger>
      <TooltipContent className="z-[60] space-y-1 rounded-md border border-border bg-background p-2">
        <p className="w-full text-center font-medium">Coordinates</p>
        <Separator />
        <p className="w-full text-center text-muted-foreground text-xs">
          {value.lat.toFixed(8)}, {value.lng.toFixed(8)}
        </p>
      </TooltipContent>
    </Tooltip>
  )
}
