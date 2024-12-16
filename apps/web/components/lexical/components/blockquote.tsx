import type { ComponentProps } from 'react'

export function RichTextBlockquote({ children }: ComponentProps<'blockquote'>) {
  return <blockquote>{children}</blockquote>
}
