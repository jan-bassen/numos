import type { WeatherInputProps } from '../generic-input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@repo/ui/components/ui/dropdown-menu'
import { buttonVariants } from '@repo/ui/components/ui/button'
import type { WeatherCode } from '@/types/database.types'
import { cn } from '@repo/ui/lib/utils'
import { useRef } from 'react'
import { Drag } from 'rete-react-plugin'
import {
  weatherCodeGroups,
  weatherConditions,
} from '@/lib/supabase/constants/weather'
import { weatherSchema } from '@repo/engine/datatypes/schemas'

export default function WeatherInput({
  value,
  onValueChange,
  onChange,
  locked,
  className,
  environment,
  valid,
  ...props
}: WeatherInputProps) {
  const dragRef = useRef<any>(null)
  Drag.useNoDrag(dragRef)

  let condition: WeatherCode | undefined | null
  try {
    condition = weatherSchema.optional().nullable().parse(value)
  } catch (e) {
    return null
  }

  return (
    <DropdownMenu>
      <span ref={environment === 'node' ? dragRef : undefined}>
        <DropdownMenuTrigger
          id={props.id}
          disabled={locked}
          className={cn(
            buttonVariants({ variant: 'outline' }),
            'h-10',
            environment === 'node' &&
              'flex h-7 min-w-36 items-center rounded-lg px-2 font-normal text-sm',
            valid === false && 'border-warning bg-warning/10',
            className,
          )}
        >
          {weatherConditions[condition as WeatherCode]?.name ||
            'Select Weather'}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-h-8">
          {weatherCodeGroups.map((group, index) => (
            <DropdownMenuSub key={group.title}>
              <DropdownMenuSubTrigger key={group.title} className="gap-2">
                <group.Icon className="size-4" />
                {group.title}
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {group.codes.map((code) => (
                  <DropdownMenuItem
                    key={code}
                    onClick={() => {
                      if (locked) return
                      onValueChange?.(code)
                      onChange?.(code)
                    }}
                  >
                    {weatherConditions[code].name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          ))}
        </DropdownMenuContent>
      </span>
    </DropdownMenu>
  )
}
