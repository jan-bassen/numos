import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@repo/ui/components/popover'
import { cn } from '@repo/ui/lib/utils'
import type { Direction } from '@/types/database.types'
import { Button, buttonVariants } from '@repo/ui/components/button'
import { useRef } from 'react'
import { Drag } from 'rete-react-plugin'
import { directions } from '@/lib/constants/directions'
import type { SingleDataTypeInputProps } from '../single-datatype-input'

export function DirectionInput({
  value,
  onChange,
  locked,
  className,
  environment,
  valid,
  ...props
}: SingleDataTypeInputProps<'direction'>) {
  const dragRef = useRef<any>(null)
  Drag.useNoDrag(dragRef)
  return (
    <Popover>
      <PopoverTrigger
        id={props.id}
        ref={environment === 'node' ? dragRef : undefined}
        disabled={locked}
        className={cn(
          buttonVariants({ variant: 'outline' }),
          'h-10 w-full min-w-36 rounded-md font-normal',
          environment === 'node' && 'h-7 rounded-lg px-2 text-sm',
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
        {value.value ? directions[value.value]?.label : 'Select Direction'}
      </PopoverTrigger>
      <PopoverContent
        sideOffset={6}
        className="grid w-fit grid-cols-3 gap-0.5 p-2"
      >
        {Object.entries(directions).map(([key, value]) => (
          <Button
            key={key}
            variant={'outline'}
            size={'icon'}
            className="flex items-center justify-center border-none p-1"
            onClick={() => {
              if (locked) return
              onChange?.({
                value: key as Direction,
                type: 'direction',
                format: 'single',
              })
            }}
          >
            {value.icons?.stroke({ className: 'size-4' })}
          </Button>
        ))}
      </PopoverContent>
    </Popover>
  )
}
