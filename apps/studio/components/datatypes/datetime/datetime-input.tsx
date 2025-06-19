import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@repo/ui/components/popover'
import { Calendar } from '@repo/ui/components/calendar'
import { type ChangeEvent, useEffect, useRef, useState } from 'react'
import { buttonVariants } from '@repo/ui/components/button'
import { Separator } from '@repo/ui/components/separator'
import { Input } from '@repo/ui/components/input'
import { cn } from '@repo/ui/lib/utils'
import { Drag } from 'rete-react-plugin'
import { datetimeSchema } from '@repo/shared/schemas/datatypes/datatype-schemas/datetime-schema'
import type { SingleDataTypeInputProps } from '../single-datatype-input'

function dateToDateString(date: Date) {
  return date.toLocaleDateString('en-EN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

function dateToTimeString(date: Date) {
  return date.toLocaleTimeString('en-EN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

export function DatetimeInput({
  value,
  onChange,
  onBlur,
  locked,
  className,
  environment,
  valid,
  ...props
}: SingleDataTypeInputProps<'datetime'>) {
  const dragRef = useRef<any>(null)
  Drag.useNoDrag(dragRef)

  let date: Date | null = null
  try {
    const timestamp =
      datetimeSchema.optional().nullable().parse(value.value) || null
    date = timestamp ? new Date(timestamp) : null
  } catch {
    date = null
  }

  const todayDateString = new Date().toLocaleDateString('en-EN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })

  const [timeString, setTimeString] = useState<string | null>(
    date ? dateToTimeString(date) : null,
  )
  const [dateString, setDateString] = useState<string | null>(
    date ? dateToDateString(date) : null,
  )

  function getDate() {
    const currentDateString = dateString ? dateString : todayDateString
    const currentTimeString = timeString ? timeString : '00:00:00'
    return !dateString && !timeString
      ? null
      : new Date(`${currentDateString} ${currentTimeString}`)
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const d = getDate()
    if (!d) return
    onChange?.({ value: d.getTime(), type: 'datetime', format: 'single' })
  }, [dateString, timeString])

  function _onBlur(e: ChangeEvent<Element>) {
    if (!locked && onBlur) onBlur(e)
  }

  return (
    <Popover>
      <PopoverTrigger
        id={props.id}
        ref={environment === 'node' ? dragRef : undefined}
        disabled={locked}
        className={cn(
          buttonVariants({ variant: 'outline' }),
          'flex w-full min-w-40 border border-border bg-background font-normal',
          environment !== 'node' && 'h-10 rounded-md py-3',
          environment === 'node' &&
            'flex h-7 min-w-36 items-center rounded-lg px-2 text-sm',
          environment === 'simulation' &&
            'h-9 items-center rounded-lg py-1.5 text-sm',
          valid === false
            ? environment === 'node'
              ? 'border-warning bg-warning/10'
              : 'border-destructive bg-destructive/10'
            : '',
          className,
        )}
      >
        {date ? date.toLocaleString('de-DE') : 'Select Date'}
      </PopoverTrigger>
      <PopoverContent
        side="top"
        sideOffset={10}
        className="m-1 max-w-[100vw] space-y-1 p-1"
      >
        <Calendar
          mode="single"
          selected={date || undefined}
          onSelect={(d) => {
            if (!locked && d instanceof Date) {
              setDateString(dateToDateString(d))
            }
          }}
          initialFocus
        />
        <Separator />
        <Input
          type="time"
          className="flex w-full justify-center border-none text-center"
          value={timeString || ''}
          onBlur={_onBlur}
          onChange={(e) => {
            if (!locked) {
              setTimeString(e.target.value)
            }
          }}
        />
      </PopoverContent>
    </Popover>
  )
}
