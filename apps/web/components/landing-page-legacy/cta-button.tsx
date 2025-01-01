'use client'

import { Button, buttonVariants } from '@repo/ui/components/ui/button'
import { cn } from '@repo/ui/lib/utils'
import { m } from 'framer-motion'
import type { ReactNode } from 'react'

export default function CTAButton({
  children,
  size,
  className,
}: {
  children?: ReactNode
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
}) {
  return (
    <m.button
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
      className={cn(
        buttonVariants({ variant: 'default', size: size }),
        className,
      )}
    >
      {children}
    </m.button>
  )
}
