import { cn } from '@repo/ui/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import NextLink from 'next/link'
import type { ComponentProps } from 'react'

const linkVariants = cva('', {
  variants: {
    effect: {
      none: '',
      underline: 'underline',
      hoverUnderline: 'no-underline hover:underline',
    },
  },
})

type LinkProps = ComponentProps<typeof NextLink> & {
  effect?: VariantProps<typeof linkVariants>['effect']
}

export function Link({
  children,
  className,
  effect = 'none',
  ...props
}: LinkProps) {
  return (
    <NextLink {...props} className={cn(linkVariants({ effect }), className)}>
      {children}
    </NextLink>
  )
}
