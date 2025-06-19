import { TabsTrigger, type TabsTriggerProps } from '@repo/ui/components/tabs'
import type { JSX, SVGProps } from 'react'
import TabOptionButton from './tab-option-button'

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

export default function TabOptionElement(props: TabOptionProps) {
  return (
    <TabsTrigger {...props} value={props.option.value} asChild>
      <TabOptionButton
        option={props.option}
        disabled={props.disabled}
        className={props.className}
        component={props.size}
      />
    </TabsTrigger>
  )
}
