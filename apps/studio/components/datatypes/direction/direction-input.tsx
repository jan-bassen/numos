import type { DirectionInputProps } from '../generic-input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@repo/ui/components/ui/popover'
import { cn } from '@repo/ui/lib/utils'
import type { Direction } from '@/types/database.types'
import { Button, buttonVariants } from '@repo/ui/components/ui/button'
import { useRef } from 'react'
import { Drag } from 'rete-react-plugin'
import { directions } from '@/lib/supabase/constants/directions'

export default function DirectionInput({
  value,
  onValueChange,
  onChange,
  locked,
  className,
  environment,
  valid,
  ...props
}: DirectionInputProps) {
  const dragRef = useRef<any>(null)
  Drag.useNoDrag(dragRef)
  return (
    <Popover>
      <span ref={environment === 'node' ? dragRef : undefined}>
        <PopoverTrigger
          id={props.id}
          disabled={locked}
          className={cn(
            buttonVariants({ variant: 'outline' }),
            'h-10 min-w-36 rounded-md font-normal',
            environment === 'node' && 'h-7 rounded-lg px-2 text-sm',
            valid === false && 'border-warning bg-warning/10',
            className,
          )}
        >
          {value ? directions[value]?.title : 'Select direction'}
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
                onValueChange?.(key as Direction)
                onChange?.(key as Direction)
              }}
            >
              <value.Icon className="size-4" />
            </Button>
          ))}
        </PopoverContent>
      </span>
    </Popover>
  )
}
