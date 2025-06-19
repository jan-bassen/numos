import { TabsTrigger, type TabsTriggerProps } from '@repo/ui/components/tabs'
import { PiCheckTickCircleBrokenStroke } from '@repo/ui/icons/pika'
import { cn } from '@repo/ui/lib/utils'
import type { JSX, SVGProps } from 'react'

export type TabOption<Type extends string | boolean = string> = {
  value: Type
  label: string
  slug?: string
  subtext?: string
  description?: string
  Icon: (props: SVGProps<SVGSVGElement>) => JSX.Element
}

type TabOptionProps = Omit<TabsTriggerProps, 'value'> & {
  option: TabOption
  size?: 'sm' | 'md'
}

export default function TabOptionElement({
  option,
  disabled,
  className,
  size = 'md',
  ...props
}: TabOptionProps) {
  if (size === 'sm') {
    return (
      <TabsTrigger
        key={option.value}
        {...props}
        disabled={disabled}
        value={option.value}
        className={cn(
          'group relative flex flex-col overflow-visible border border-background outline-[1.7px] outline-border transition-none enabled:outline-foreground data-[state=active]:outline data-[state=inactive]:disabled:bg-muted/30 data-[state=active]:disabled:opacity-100 data-[state=inactive]:enabled:border-border data-[state=active]:enabled:bg-card',
          ' gap-1 px-6 py-4',
          className,
        )}
      >
        {!disabled && (
          <PiCheckTickCircleBrokenStroke className="-left-2 -top-1.5 zoom-in-50 absolute hidden h-5 w-5 animate-in rounded-full bg-background stroke-foreground pr-0.5 pb-0.5 group-data-[state=active]:flex" />
        )}
        <div className="flex w-full items-center justify-start gap-1.5">
          {option.Icon?.({ className: 'size-4' })}
          <h3>{option.label}</h3>
        </div>
        {/* <p className="text-background group-hover:text-muted-foreground font-light w-full text-left  text-2xs leading-tight">
          {option.subtext}
        </p> */}
      </TabsTrigger>
    )
  }
  return (
    <TabsTrigger
      key={option.value}
      {...props}
      disabled={disabled}
      value={option.value}
      className={cn(
        'group relative flex grow  overflow-visible outline-[1.7px] outline-border transition-none enabled:outline-foreground data-[state=active]:outline data-[state=inactive]:disabled:bg-muted/30 data-[state=active]:disabled:opacity-100 data-[state=inactive]:enabled:border data-[state=active]:enabled:bg-card',
        'flex-col min-h-[6rem] gap-3 px-2 pt-3 pb-2 md:px-5 lg:w-full xl:grow-0 xl:gap-5 xl:px-2',
        className,
      )}
    >
      {!disabled && (
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
  )
}
