import type { buttonVariants } from '@repo/ui/components/ui/button'
import type { VariantProps } from 'class-variance-authority'

export type ButtonVariant = VariantProps<typeof buttonVariants>['variant']
