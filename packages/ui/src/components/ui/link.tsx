import { cn } from '@repo/ui/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import NextLink from 'next/link'
import type { ComponentProps } from 'react'
import { buttonVariants } from './button'

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
  asButton?: VariantProps<typeof buttonVariants>
}

export function Link({
  children,
  className,
  effect = 'none',
  asButton,
  ...props
}: LinkProps) {
  return (
    <NextLink
      {...props}
      className={cn(
        asButton ? buttonVariants(asButton) : linkVariants({ effect }),
        className,
      )}
    >
      {children}
    </NextLink>
  )
}
