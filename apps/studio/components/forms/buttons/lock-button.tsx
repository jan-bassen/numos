'use client'

import { Button, type ButtonProps } from '@repo/ui/components/ui/button'
import { PiLockCloseStroke, PiLockOpenStroke } from '@repo/ui/icons/pika'
import { cn } from '@repo/ui/lib/utils'

export function LockButton({
  locked,
  setLocked,
  className,
}: ButtonProps & { locked: boolean; setLocked: (value: boolean) => void }) {
  return locked ? (
    <Button
      variant="default"
      className={cn('gap-1.5 pl-3', className)}
      onClick={() => setLocked(false)}
    >
      <PiLockOpenStroke className="size-4" />
      Unlock
    </Button>
  ) : (
    <Button
      variant={'outline'}
      className={cn('gap-1.5 pl-3', className)}
      onClick={() => setLocked(true)}
    >
      <PiLockCloseStroke className="size-4" />
      Lock
    </Button>
  )
}
