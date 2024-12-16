import { cn } from '@repo/ui/lib/utils'
import type { ComponentProps, ReactNode } from 'react'

export function RichTextParagraph({
  children,
  className,
}: ComponentProps<'p'> & { children: ReactNode[] }) {
  return (
    <p className={cn(className, ' text-pretty')}>
      {!children?.length ? <br /> : children}
    </p>
  )
}
