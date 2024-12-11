'use client'

import type * as React from 'react'
import * as SelectPrimitive from '@radix-ui/react-select'
import {
  Check,
  ChevronDown,
  ChevronDownIcon,
  ChevronUpIcon,
} from 'lucide-react'

import { cn } from '@repo/ui/lib/utils'

const Select = SelectPrimitive.Root
export type RootSelectProps = React.ComponentProps<typeof SelectPrimitive.Root>

const SelectGroup = SelectPrimitive.Group

const SelectValue = SelectPrimitive.Value

const SelectTrigger = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger>) => (
  <SelectPrimitive.Trigger
    className={cn(
      'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-60',
      className,
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
)
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectTriggerThick = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger>) => (
  <SelectPrimitive.Trigger
    className={cn(
      'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
      className,
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="mt-1 ml-0.5 h-5 w-5" strokeWidth={4} />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
)
SelectTriggerThick.displayName = SelectPrimitive.Trigger.displayName

export type SelectContentProps = React.ComponentProps<
  typeof SelectPrimitive.Content
> & { scrollable?: boolean }

const SelectContent = ({
  className,
  children,
  position = 'popper',
  scrollable = false,
  ...props
}: SelectContentProps) => (
  <SelectPrimitive.Portal
  /* onWheel={(e) => {
      scrollable && e.stopPropagation()
    }} */
  >
    <SelectPrimitive.Content
      onWheel={(e) => {
        scrollable && e.stopPropagation()
      }}
      className={cn(
        'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=closed]:animate-out data-[state=open]:animate-in',
        position === 'popper' &&
          'data-[side=left]:-translate-x-1 data-[side=top]:-translate-y-1 data-[side=right]:translate-x-1 data-[side=bottom]:translate-y-1',
        className,
      )}
      position={position}
      {...props}
    >
      {scrollable && (
        <SelectPrimitive.ScrollUpButton className="-translate-x-1/2 absolute top-2 left-1/2 z-[100] flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md">
          <ChevronUpIcon className="size-5 pb-[2px]" />
        </SelectPrimitive.ScrollUpButton>
      )}
      <SelectPrimitive.Viewport
        className={cn(
          'p-1',
          position === 'popper' &&
            'h-[var(--radix-select-trigger-height)] max-h-[calc(var(--radix-select-content-available-height)-1rem)] w-full min-w-[var(--radix-select-trigger-width)]',
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      {scrollable && (
        <SelectPrimitive.ScrollDownButton className="-translate-x-1/2 absolute bottom-2 left-1/2 z-[100] flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md">
          <ChevronDownIcon className="size-5 pt-[2px]" />
        </SelectPrimitive.ScrollDownButton>
      )}
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
)
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectLabel = ({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) => (
  <SelectPrimitive.Label
    className={cn('py-1.5 pr-2 pl-8 font-semibold text-sm', className)}
    {...props}
  />
)
SelectLabel.displayName = SelectPrimitive.Label.displayName

const SelectItem = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) => (
  <SelectPrimitive.Item
    className={cn(
      'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pr-2 pl-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className,
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>

    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
)
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectSeparator = ({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) => (
  <SelectPrimitive.Separator
    className={cn('-mx-1 my-1 h-px bg-muted', className)}
    {...props}
  />
)
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectTriggerThick,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
}
