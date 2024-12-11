import {
  Tabs,
  TabsList,
  type TabsListProps,
  type TabsProps,
  type TabsTriggerProps,
} from '@repo/ui/components/ui/tabs'
import { cn } from '@repo/ui/lib/utils'
import type { TabOption } from './tab-option'
import TabOptionElement from './tab-option'
import { Button } from '@repo/ui/components/ui/button'
import { useEffect, useState } from 'react'
import TabOptionButton from './tab-option-button'

export type TabSelectProps = TabsProps & {
  options: TabOption[]
  disabled?: boolean
  list?: Omit<TabsListProps, 'className'>
  trigger?: Omit<TabsTriggerProps, 'disabled' | 'value'>
}

export function TabSelect({
  options,
  disabled,
  className,
  list,
  trigger,
  value,
  onChange,
  ...props
}: TabSelectProps) {
  /*
  const [open, setOpen] = useState(!!value)
  useEffect(() => {
    setOpen(false)
  }, [value])

   if (!open) {
    const option = options.find((o) => o.value === value)
    if (!option) throw new Error('Option not found')
    return (
      <div className={cn('p-1 pt-1.5 pl-1.5 sm:gap-2 md:p-1.5', className)}>
        <TabOptionButton
          data-state={'inactive'}
          option={option}
          disabled={disabled}
          className={cn('w-full', trigger?.className)}
          onClick={() => setOpen(true)}
          component={options.length > 3 ? 'sm' : 'md'}
        />
      </div>
    )
  } */

  return (
    <Tabs {...props} value={value} className={'w-full'}>
      <TabsList
        {...list}
        className={cn(
          '!justify-start scrollbar-none h-fit w-full gap-1.5 overflow-scroll bg-transparent p-1 pt-1.5 pl-1.5 sm:gap-2 md:p-1.5',
          options.length > 3 &&
            'xs:grid xs:grid-cols-2 flex-col sm:grid-cols-3 lg:grid-cols-4',
          className,
        )}
      >
        {options.map((option, i) => (
          <TabOptionElement
            {...trigger}
            size={options.length > 3 ? 'sm' : 'md'}
            className={cn('-xs:!w-full', trigger?.className)}
            option={option}
            key={option.value}
            disabled={disabled}
          />
        ))}
      </TabsList>
    </Tabs>
  )
}
