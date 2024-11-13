'use client'

import type * as React from 'react'
import * as LabelPrimitive from '@radix-ui/react-label'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@repo/ui/lib/utils'

const labelVariants = cva(
  'font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
)

type LabelProps = React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
  VariantProps<typeof labelVariants>

const Label = ({ className, ...props }: LabelProps) => (
  <LabelPrimitive.Root className={cn(labelVariants(), className)} {...props} />
)
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
