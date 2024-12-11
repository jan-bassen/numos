import { Button, type ButtonProps } from '@repo/ui/components/ui/button'
import { PiCheckTickCircleBrokenStroke } from '@repo/ui/icons/pika'
import { cn } from '@repo/ui/lib/utils'
import type { TabOption } from './tab-option'

export default function TabOptionButton({
  option,
  disabled,
  className,
  component = 'md',
  ...props
}: ButtonProps & { option: TabOption; component?: 'sm' | 'md' }) {
  if (component === 'sm') {
    return (
      <Button
        key={option.value}
        {...props}
        variant={'outline'}
        size={'none'}
        disabled={disabled}
        className={cn(
          'group relative flex flex-col overflow-visible rounded-sm border border-background outline-1.7 outline-border transition-none enabled:outline-foreground data-[state=active]:outline data-[state=inactive]:disabled:bg-muted/30 data-[state=active]:disabled:opacity-100 data-[state=inactive]:enabled:border-border data-[state=active]:enabled:bg-card',
          ' gap-1 px-6 !py-4',
          className,
        )}
      >
        {!disabled && (
          <PiCheckTickCircleBrokenStroke className="-left-2 -top-1.5 zoom-in-50 absolute hidden h-5 w-5 animate-in rounded-full bg-background stroke-foreground pr-0.5 pb-0.5 group-data-[state=active]:flex" />
        )}
        <div className="flex w-full shrink-0 items-center justify-start gap-1.5">
          {option.Icon?.({ className: 'size-4' })}
          <h3>{option.label}</h3>
        </div>
        {/* <p className="text-background group-hover:text-muted-foreground font-light w-full text-left  text-2xs leading-tight">
          {option.subtext}
        </p> */}
      </Button>
    )
  }
  return (
    <Button
      key={option.value}
      {...props}
      variant={'outline'}
      size={'none'}
      disabled={disabled}
      className={cn(
        'group relative flex flex-grow overflow-visible rounded-sm outline-1.7 outline-border transition-none enabled:outline-foreground data-[state=active]:enabled:outline data-[state=inactive]:disabled:bg-muted/30 data-[state=active]:disabled:opacity-100 data-[state=inactive]:enabled:border data-[state=active]:enabled:bg-card',
        'min-h-[6rem] flex-col gap-3 px-2 pt-3 pb-2 md:px-5 lg:w-full xl:flex-grow-0 xl:gap-5 xl:px-2',
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
    </Button>
  )
}
