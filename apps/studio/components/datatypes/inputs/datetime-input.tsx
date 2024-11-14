import type { DatetimeInputProps } from '../generic-input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@repo/ui/components/ui/popover'
import { Calendar } from '@repo/ui/components/ui/calendar'
import { type ChangeEvent, useEffect, useRef, useState } from 'react'
import { buttonVariants } from '@repo/ui/components/ui/button'
import { Separator } from '@repo/ui/components/ui/separator'
import { Input } from '@repo/ui/components/ui/input'
import { cn } from '@repo/ui/lib/utils'
import { Drag } from 'rete-react-plugin'
import { datetimeSchema } from '@repo/engine/datatypes/schemas'

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

export default function DatetimeInput({
  value,
  onValueChange,
  onChange,
  onBlur,
  locked,
  className,
  environment,
  valid,
  ...props
}: DatetimeInputProps) {
  const timestamp = datetimeSchema.optional().nullable().parse(value) || null
  const date = timestamp ? new Date(timestamp) : null

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
    onValueChange?.(d.getTime())
    onChange?.(d.getTime())
  }, [dateString, timeString])

  function _onBlur(e: ChangeEvent<Element>) {
    if (!locked && onBlur) onBlur(e)
  }

  const dragRef = useRef<any>(null)
  Drag.useNoDrag(dragRef)
  return (
    <Popover>
      <div
        ref={environment === 'node' ? dragRef : undefined}
        className="w-full"
      >
        <PopoverTrigger
          id={props.id}
          disabled={locked}
          className={cn(
            buttonVariants({ variant: 'outline' }),
            'flex w-full min-w-40 border border-border bg-background font-normal',
            environment !== 'node' && 'h-10 rounded-md py-3',
            environment === 'node' &&
              'flex h-7 min-w-36 items-center rounded-lg px-2 text-sm',
            valid === false && 'border-warning bg-warning/10',
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
      </div>
    </Popover>
  )
}
