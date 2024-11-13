'use client'

import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { ChevronDown } from 'lucide-react'
import { cn } from '@repo/ui/lib/utils'
import type { ComponentProps } from 'react'

const Accordion = AccordionPrimitive.Root

type AccordionItemProps = ComponentProps<typeof AccordionPrimitive.Item>
const AccordionItem = ({ className, ...props }: AccordionItemProps) => (
  <AccordionPrimitive.Item className={cn('border-b', className)} {...props} />
)
AccordionItem.displayName = 'AccordionItem'

type AccordionTriggerProps = ComponentProps<
  typeof AccordionPrimitive.Trigger
> & {
  hideChevron?: boolean
}
const AccordionTrigger = ({
  className,
  children,
  hideChevron = false,
  ...props
}: AccordionTriggerProps) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      className={cn(
        'flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline',
        !hideChevron && '[&[data-state=open]>svg]:rotate-180',
        className,
      )}
      {...props}
    >
      {children}
      {!hideChevron && (
        <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
      )}
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
)
AccordionTrigger.displayName = 'AccordionTrigger'

type AccordionContentProps = ComponentProps<typeof AccordionPrimitive.Content>
const AccordionContent = ({
  className,
  children,
  ...props
}: AccordionContentProps) => (
  <AccordionPrimitive.Content
    className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn('pt-0 pb-4', className)}>{children}</div>
  </AccordionPrimitive.Content>
)
AccordionContent.displayName = 'AccordionContent'

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
