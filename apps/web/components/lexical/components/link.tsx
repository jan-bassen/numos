import Link, { type LinkProps as InternalLinkProps } from 'next/link'
import type { ComponentProps } from 'react'

type LinkProps = InternalLinkProps & ComponentProps<'a'>
type PayloadProps = Pick<LinkProps, 'href' | 'rel' | 'target' | 'children'>

export function RichTextLink({ children, ...props }: PayloadProps) {
  return (
    <Link {...props} className=" font-semibold underline hover:no-underline">
      {children}
    </Link>
  )
}
