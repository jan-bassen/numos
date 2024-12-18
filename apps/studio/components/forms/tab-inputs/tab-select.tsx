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

export type TabSelectProps = TabsProps & {
  size?: 'sm' | 'md'
  options: TabOption[]
  disabled?: boolean
  list?: Omit<TabsListProps, 'className'>
  trigger?: Omit<TabsTriggerProps, 'disabled' | 'value'>
}

export function TabSelect({
  size,
  options,
  disabled,
  className,
  list,
  trigger,
  value,
  onChange,
  ...props
}: TabSelectProps) {
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
        {options.map((option) => (
          <TabOptionElement
            {...trigger}
            size={size || (options.length > 3 ? 'sm' : 'md')}
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
