'use client'

import { useEffect, useState } from 'react'
import { seedIfEmpty } from '@/lib/data/seed'

/**
 * Seeds the client store on first load and gates the app until it's ready, so no
 * screen renders against an empty store on a fresh visit.
 */
export function DataBootProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let active = true
    seedIfEmpty()
      .catch((error) => {
        console.error('Failed to seed demo data', error)
      })
      .finally(() => {
        if (active) setReady(true)
      })
    return () => {
      active = false
    }
  }, [])

  if (!ready) {
    return (
      <div className="grid min-h-dvh w-full place-items-center bg-background">
        <p className="animate-pulse font-medium text-muted-foreground text-sm">
          Loading studio…
        </p>
      </div>
    )
  }

  return <>{children}</>
}
