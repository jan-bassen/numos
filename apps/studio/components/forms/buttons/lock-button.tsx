'use client'

import { Button, type ButtonProps } from '@repo/ui/components/ui/button'
import { PiLockCloseStroke, PiLockOpenStroke } from '@repo/ui/icons/pika'
import { cn } from '@repo/ui/lib/utils'

export function LockButton({
  locked,
  setLocked,
  className,
}: ButtonProps & { locked: boolean; setLocked: (value: boolean) => void }) {
  return (
    <Button
      variant={'outline'}
      className={cn('gap-1.5 pl-3 min-w-24', className)}
      onClick={() => setLocked(!locked)}
    >
      {locked ? (
        <>
          <PiLockOpenStroke className="size-4" />
          Unlock
        </>
      ) : (
        <>
          <PiLockCloseStroke className="size-4" />
          Lock
        </>
      )}
    </Button>
  )
}
