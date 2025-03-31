'use client'

import { syncAccount } from '@/server/sync/sync-account'
import { Button } from '@repo/ui/components/button'
import { useState } from 'react'

export default function TestPage() {
  const [res, setRes] = useState<string | null>(null)
  return (
    <div className="grid h-screen w-full place-items-center">
      <Button
        onClick={async () => {
          const res = await syncAccount()
          setRes(JSON.stringify(res, null, 2))
        }}
      >
        Sync
      </Button>
      <pre>{res}</pre>
    </div>
  )
}
