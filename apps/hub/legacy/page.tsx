'use client'

import { useEffect, useState } from 'react'
import type { ImportingState } from '@/server/sync/sync-account'
export default function SyncComponent() {
  const [status, setStatus] = useState<ImportingState | null>(null)

  useEffect(() => {
    const eventSource = new EventSource('/api/events/test')

    eventSource.onmessage = (e) => {
      const data = JSON.parse(e.data)
      setStatus(data)
    }

    eventSource.addEventListener('end', (e) => {
      const data = JSON.parse(e.data)
      setStatus(data)
      eventSource.close()
    })

    eventSource.onerror = (e) => {
      console.error('Source Error:', e)
      eventSource.close()
    }

    return () => eventSource.close()
  }, [])

  return (
    <div>
      <pre>{JSON.stringify(status, null, 2)}</pre>
    </div>
  )
}
