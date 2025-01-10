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
import { weatherCodeGroups, weatherConditions } from '@/lib/constants/weather'
import { weatherSchema } from '@repo/shared/schemas/datatypes/datatype-schemas/weather-schema'
import type { SingleDataTypeInputProps } from '../single-datatype-input'

export function WeatherInput({
  value,
  onChange,
  locked,
  className,
  environment,
  valid,
  ...props
}: SingleDataTypeInputProps<'weather'>) {
  const dragRef = useRef<any>(null)
  Drag.useNoDrag(dragRef)

  let condition: WeatherCode | undefined | null
  try {
    condition = weatherSchema.optional().nullable().parse(value.value)
  } catch (e) {
    condition = null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        id={props.id}
        ref={environment === 'node' ? dragRef : undefined}
        disabled={locked}
        className={cn(
          buttonVariants({ variant: 'outline' }),
          'h-10 w-full font-normal',
          environment === 'node' &&
            'flex h-7 min-w-36 items-center rounded-lg px-2 text-sm',
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
        {weatherConditions[condition as WeatherCode]?.name || 'Select Weather'}
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
                    onChange?.({
                      value: code,
                      type: 'weather',
                      format: 'single',
                    })
                  }}
                >
                  {weatherConditions[code].name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
