import { Tabs, TabsList } from '@repo/ui/components/ui/tabs'
import { cn } from '@repo/ui/lib/utils'
import type { ChangeEvent } from 'react'
import type { TabOption } from './tab-option'
import TabOptionElement from './tab-option'

export type TabSelectProps = {
  options: TabOption[]
  value?: string
  onChange?: (arg0: string) => void
  onBlur?: (arg0: ChangeEvent) => void
  locked?: boolean
  className?: string
}

export function TabSelect({
  options,
  value,
  onChange,
  onBlur,
  locked,
  className,
}: TabSelectProps) {
  return (
    <Tabs value={value} onValueChange={onChange} onBlur={onBlur}>
      <TabsList
        className={cn(
          '!justify-start scrollbar-none h-fit gap-1 overflow-scroll bg-transparent p-1 pt-1.5 pl-1.5 sm:gap-2 md:p-1.5',
          className,
        )}
      >
        {options.map((option, i) => (
          <TabOptionElement
            option={option}
            locked={locked}
            key={option.value}
          />
        ))}
      </TabsList>
    </Tabs>
  )
}
