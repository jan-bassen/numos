import { PiAutomationStroke } from '@repo/ui/icons/pika'
import { buttonVariants } from '@repo/ui/components/ui/button'
import { cn } from '@repo/ui/lib/utils'
import Link from 'next/link'
import type { ComponentProps } from 'react'

export function LogicButton({
  className,
  children,
  ...props
}: ComponentProps<typeof Link>) {
  return (
    <Link
      {...props}
      className={cn(
        buttonVariants({ variant: 'outline' }),
        'relative flex min-h-28 w-fulitems-center max-w-[40rem] justify-center gap-2 overflow-hidden',
        className,
      )}
    >
      <PiAutomationStroke className="my-auto size-4" />
      {children}
      <div className="!bg-dots_grid absolute size-full translate-x-[12.5px] translate-y-[15px] bg-[50px_50px] bg-[length:100px_100px] opacity-25" />
    </Link>
  )
}
