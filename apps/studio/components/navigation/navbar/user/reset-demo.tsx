'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@repo/ui/components/alert-dialog'
import { buttonVariants } from '@repo/ui/components/button'
import { DropdownMenuItem } from '@repo/ui/components/dropdown-menu'
import { RotateCcw } from 'lucide-react'
import { useState } from 'react'
import { clearAll } from '@/lib/data/store'

/**
 * "Start over" affordance for the demo. Wipes the per-visitor IndexedDB store and
 * reloads — `DataBootProvider` reseeds the sample collection on the next load, so
 * the visitor lands back on a fresh Demo Collection.
 */
export function ResetDemo() {
  const [open, setOpen] = useState(false)
  const [resetting, setResetting] = useState(false)

  async function reset() {
    setResetting(true)
    try {
      await clearAll()
    } finally {
      // Full reload so every context re-reads the freshly seeded store.
      window.location.assign('/collections')
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <DropdownMenuItem
        // Keep the dialog mounted: don't let the dropdown's auto-close unmount it.
        onSelect={(e) => {
          e.preventDefault()
          setOpen(true)
        }}
      >
        <RotateCcw className="size-4" />
        Reset demo
      </DropdownMenuItem>
      <AlertDialogContent className="gap-6">
        <AlertDialogHeader>
          <AlertDialogTitle>Reset the demo?</AlertDialogTitle>
          <AlertDialogDescription>
            This clears everything you've changed in this browser and restores
            the original sample collection. It only affects this device.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={resetting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className={buttonVariants({ variant: 'destructive' })}
            disabled={resetting}
            onClick={(e) => {
              e.preventDefault()
              reset()
            }}
          >
            {resetting ? 'Resetting…' : 'Reset demo'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
