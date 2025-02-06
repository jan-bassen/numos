'use client'

import { Input, type InputProps } from '@repo/ui/components/ui/input'
import { cn } from '@repo/ui/lib/utils'

export function HeaderTitleInput({
  className,
  value,
  style,
  ...props
}: InputProps) {
  const valueLength = typeof value === 'string' ? value.length : 10
  return (
    <Input
      {...props}
      className={cn(
        '!h-10 sm:!h-11 -translate-y-[2px] !text-3xl sm:!text-4xl border-0 px-1 py-0 pt-0.5 font-bold focus-visible:text-3xl focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-2 disabled:opacity-100 md:text-4xl focus-visible:md:text-4xl',
        className,
      )}
      value={value}
      style={{
        width: `calc(${valueLength || 10}ch + 1rem)`,
        ...style,
      }}
    />
  )
}
