import { Tabs, TabsList, TabsTrigger } from '@repo/ui/components/ui/tabs'
import { PiCheckTickCircleBrokenStroke } from '@repo/ui/icons/pika'
import { cn } from '@repo/ui/lib/utils'
import type { ChangeEvent, JSX } from 'react';

export type TabToggleOption = {
  value: boolean
  label: string
  slug?: string
  subtext?: string
  subtitle?: string
  Icon: (props: JSX.IntrinsicElements['svg']) => JSX.Element
}

export function TabToggle({
  options,
  value,
  onChange,
  onBlur,
  locked = false,
  className,
}: {
  options: TabToggleOption[]
  value?: boolean
  onChange: (arg0: boolean) => void
  onBlur?: (arg0: ChangeEvent) => void
  locked?: boolean
  className?: string
}) {
  function convertStringToBoolean(value: string) {
    if (value === 'true') return true
    if (value === 'false') return false
    throw new Error(`Cannot convert ${value} to boolean.`)
  }
  function convertBooleanToString(value: boolean) {
    return value.toString()
  }

  return (
    <Tabs
      value={value ? convertBooleanToString(value) : undefined}
      onValueChange={(v) => onChange(convertStringToBoolean(v))}
      onBlur={onBlur}
    >
      <TabsList
        className={cn(
          '!justify-start scrollbar-none h-fit gap-1 overflow-scroll bg-transparent p-1 pt-1.5 pl-1.5 sm:gap-2 md:min-w-[22rem] md:p-1.5',
          className,
        )}
      >
        {options.map((option, i) => (
          <TabsTrigger
            disabled={locked}
            key={convertBooleanToString(option.value)}
            value={convertBooleanToString(option.value)}
            className="group relative flex min-h-[6rem] flex-grow flex-col gap-3 overflow-visible px-2 pt-3 pb-2 outline-1.7 outline-border transition-none enabled:outline-foreground data-[state=active]:outline data-[state=active]:disabled:opacity-100 data-[state=active]:enabled:bg-card md:px-5 lg:w-full xl:flex-grow-0 xl:gap-5 xl:px-2"
          >
            {!locked && (
              <PiCheckTickCircleBrokenStroke className="-left-2 -top-1.5 zoom-in-50 absolute hidden h-5 w-5 animate-in rounded-full bg-background stroke-1.5 stroke-foreground pr-0.5 pb-0.5 group-data-[state=active]:flex" />
            )}
            {option.Icon?.({ className: 'size-4' })}
            <div className="flex flex-col gap-1">
              <h3>{option.label}</h3>
              {option.subtext && (
                <p className="w-20 whitespace-normal text-center font-light text-2xs leading-tight xl:w-32">
                  {option.subtext}
                </p>
              )}
            </div>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
