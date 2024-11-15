'use client'

import { setActionLock } from '@/lib/supabase/db/actions'
import { setAttributeLock } from '@/lib/supabase/db/attributes'
import { setCollectionSettingsLock } from '@/lib/supabase/db/collections'
import { Button } from '@repo/ui/components/ui/button'
import { PiLockCloseStroke, PiLockOpenStroke } from '@repo/ui/icons/pika'
import { cn } from '@repo/ui/lib/utils'
import { useEffect } from 'react'

export default function LockButton({
  id,
  element,
  locked,
  setLocked,
  className,
}: {
  id: string
  element: 'action' | 'attribute' | 'collection-settings'
  locked: boolean
  setLocked: (value: boolean) => void
  className?: string
}) {
  useEffect(() => {
    switch (element) {
      case 'action':
        setActionLock(id, locked)
        break
      case 'attribute':
        setAttributeLock(id, locked)
        break
      case 'collection-settings':
        setCollectionSettingsLock(id, locked)
        break
    }
  }, [locked, element, id])

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
