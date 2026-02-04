'use client'

import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger } from '@repo/ui/components/tabs'
import { ComponentCard } from '@repo/ui/showcase/component-card'
import { ExampleButton } from '@repo/ui/showcase/examples/example-button'
import { ExampleCard } from '@repo/ui/showcase/examples/example-card'
import { ExampleInput } from '@repo/ui/showcase/examples/example-input'
import { ExampleBadge } from '@repo/ui/showcase/examples/example-badge'
import { ExampleAlert } from '@repo/ui/showcase/examples/example-alert'
import { ExampleAvatar } from '@repo/ui/showcase/examples/example-avatar'
import { ExampleDropdown } from '@repo/ui/showcase/examples/example-dropdown'
import { ExampleToggle } from '@repo/ui/showcase/examples/example-toggle'
import { ExampleTooltip } from '@repo/ui/showcase/examples/example-tooltip'
import { ExampleAccordion } from '@repo/ui/showcase/examples/example-accordion'
import { ExampleTabs } from '@repo/ui/showcase/examples/example-tabs'
import { ExampleDialog } from '@repo/ui/showcase/examples/example-dialog'
import { ExampleCheckbox } from '@repo/ui/showcase/examples/example-checkbox'
import { ExampleRadioGroup } from '@repo/ui/showcase/examples/example-radio-group'
import { ExampleSelect } from '@repo/ui/showcase/examples/example-select'
import { ExampleSlider } from '@repo/ui/showcase/examples/example-slider'
import { ExampleSwitch } from '@repo/ui/showcase/examples/example-switch'
import { ExampleProgress } from '@repo/ui/showcase/examples/example-progress'
import { ExampleSkeleton } from '@repo/ui/showcase/examples/example-skeleton'
import { ExampleCalendar } from '@repo/ui/showcase/examples/example-calendar'
import { ExampleTable } from '@repo/ui/showcase/examples/example-table'
import { ExamplePagination } from '@repo/ui/showcase/examples/example-pagination'
import { ExampleBreadcrumb } from '@repo/ui/showcase/examples/example-breadcrumb'
import { ExampleCommand } from '@repo/ui/showcase/examples/example-command'
import { ExampleHoverCard } from '@repo/ui/showcase/examples/example-hover-card'
import { ExampleSheet } from '@repo/ui/showcase/examples/example-sheet'
import { ExamplePopover } from '@repo/ui/showcase/examples/example-popover'
import { ExampleCollapsible } from '@repo/ui/showcase/examples/example-collapsible'
import { ExampleSeparator } from '@repo/ui/showcase/examples/example-separator'

export function ComponentsGrid() {
  const [filter, setFilter] = useState('all')

  const components = [
    { name: 'Button', element: <ExampleButton />, category: 'inputs' },
    { name: 'Card', element: <ExampleCard />, category: 'layout' },
    { name: 'Input', element: <ExampleInput />, category: 'inputs' },
    { name: 'Badge', element: <ExampleBadge />, category: 'display' },
    { name: 'Alert', element: <ExampleAlert />, category: 'feedback' },
    { name: 'Avatar', element: <ExampleAvatar />, category: 'display' },
    { name: 'Dropdown', element: <ExampleDropdown />, category: 'inputs' },
    { name: 'Toggle', element: <ExampleToggle />, category: 'inputs' },
    { name: 'Tooltip', element: <ExampleTooltip />, category: 'feedback' },
    { name: 'Accordion', element: <ExampleAccordion />, category: 'layout' },
    { name: 'Tabs', element: <ExampleTabs />, category: 'navigation' },
    { name: 'Dialog', element: <ExampleDialog />, category: 'feedback' },
    { name: 'Checkbox', element: <ExampleCheckbox />, category: 'inputs' },
    { name: 'Radio Group', element: <ExampleRadioGroup />, category: 'inputs' },
    { name: 'Select', element: <ExampleSelect />, category: 'inputs' },
    { name: 'Slider', element: <ExampleSlider />, category: 'inputs' },
    { name: 'Switch', element: <ExampleSwitch />, category: 'inputs' },
    { name: 'Progress', element: <ExampleProgress />, category: 'feedback' },
    { name: 'Skeleton', element: <ExampleSkeleton />, category: 'feedback' },
    { name: 'Calendar', element: <ExampleCalendar />, category: 'inputs' },
    { name: 'Table', element: <ExampleTable />, category: 'display' },
    {
      name: 'Pagination',
      element: <ExamplePagination />,
      category: 'navigation',
    },
    {
      name: 'Breadcrumb',
      element: <ExampleBreadcrumb />,
      category: 'navigation',
    },
    { name: 'Command', element: <ExampleCommand />, category: 'inputs' },
    { name: 'Hover Card', element: <ExampleHoverCard />, category: 'feedback' },
    { name: 'Sheet', element: <ExampleSheet />, category: 'layout' },
    { name: 'Popover', element: <ExamplePopover />, category: 'feedback' },
    {
      name: 'Collapsible',
      element: <ExampleCollapsible />,
      category: 'layout',
    },
    { name: 'Separator', element: <ExampleSeparator />, category: 'layout' },
  ]

  const filteredComponents =
    filter === 'all'
      ? components
      : components.filter((component) => component.category === filter)

  return (
    <div className="space-y-6">
      <Tabs defaultValue="all" onValueChange={setFilter}>
        <TabsList className="flex flex-wrap">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="inputs">Inputs</TabsTrigger>
          <TabsTrigger value="display">Display</TabsTrigger>
          <TabsTrigger value="layout">Layout</TabsTrigger>
          <TabsTrigger value="navigation">Navigation</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {filteredComponents.map((component) => (
          <ComponentCard
            key={component.name}
            name={component.name}
            category={component.category}
          >
            {component.element}
          </ComponentCard>
        ))}
      </div>
    </div>
  )
}
