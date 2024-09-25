import { Tabs, TabsList, TabsTrigger } from '@repo/ui/components/ui/tabs'
import { PiCheckTickCircleBrokenStroke } from '@repo/ui/icons/pika'
import { cn } from '@/lib/utils'
import type { ChangeEvent } from 'react'

export type TabSelectOption = {
  value: string
  label: string
  subtext?: string
  description?: string
  Icon: (props: JSX.IntrinsicElements['svg']) => JSX.Element
}

export function TabSelect({
  options,
  value,
  onChange,
  onBlur,
  locked,
  className,
}: {
  options: TabSelectOption[]
  value: string
  onChange: (arg0: string) => void
  onBlur?: (arg0: ChangeEvent) => void
  locked?: boolean
  className?: string
}) {
  return (
    <Tabs value={value} onValueChange={onChange} onBlur={onBlur}>
      <TabsList
        className={cn(
          'md: !justify-start scrollbar-none h-fit gap-1 overflow-scroll bg-transparent p-1 pt-1.5 pl-1.5 sm:gap-2 md:w-[30rem] md:p-1.5',
          className,
        )}
      >
        {options.map((option, i) => (
          <TabsTrigger
            disabled={locked}
            key={option.value}
            value={option.value}
            className="group relative flex min-h-[6rem] flex-grow flex-col gap-3 overflow-visible px-2 pt-3 pb-2 outline-1.7 outline-border transition-none enabled:outline-foreground data-[state=active]:outline data-[state=active]:disabled:opacity-100 data-[state=active]:enabled:bg-card md:px-5 lg:w-full xl:flex-grow-0 xl:gap-5 xl:px-2"
          >
            {!locked && (
              <PiCheckTickCircleBrokenStroke className="-left-2 -top-1.5 zoom-in-50 absolute hidden h-5 w-5 animate-in rounded-full bg-background stroke-foreground pr-0.5 pb-0.5 group-data-[state=active]:flex" />
            )}
            {option.Icon?.({ className: 'size-4' })}
            <div className="flex flex-col gap-1">
              <h3>{option.label}</h3>
              {option.subtext && (
                <p className="w-18 whitespace-normal text-center font-light text-2xs leading-tight sm:w-20 xl:w-32">
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
