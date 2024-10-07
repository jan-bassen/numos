'use client'

import { cn } from '@repo/ui/lib/utils'
import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

export function AnimateIn({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={cn('flex flex-col', className)}
    >
      {children}
    </motion.div>
  )
}

export function AnimateOnScroll({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <motion.div
      initial={{ y: 250, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ margin: '50px', once: true }}
      transition={{ type: 'spring', stiffness: 100, damping: 13 }}
      className={cn('flex flex-col', className)}
    >
      {children}
    </motion.div>
  )
}
