import { Button, type ButtonProps } from '@repo/ui/components/button'
import { PiLockCloseStroke, PiLockOpenStroke } from '@repo/ui/icons/pika'
import { cn } from '@repo/ui/lib/utils'

export function LockButton({
  locked,
  setLocked,
  className,
  unlock_text,
  lock_text,
}: ButtonProps & {
  locked: boolean
  setLocked: (value: boolean) => void
  unlock_text?: string
  lock_text?: string
}) {
  return (
    <Button
      variant={'outline'}
      className={cn('gap-1.5 pl-3 min-w-24', className)}
      onClick={() => setLocked(!locked)}
    >
      {locked ? (
        <>
          <PiLockOpenStroke className="size-4" />
          {unlock_text || 'Unlock'}
        </>
      ) : (
        <>
          <PiLockCloseStroke className="size-4" />
          {lock_text || 'Lock'}
        </>
      )}
    </Button>
  )
}
