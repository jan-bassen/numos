import { toast } from '@repo/ui/components/sonner'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import type { WalletSyncUpdate } from '@/server/sync/sync-account'
import { tryCatch } from '@repo/shared/result/try'
import { Ok } from '@repo/shared/result/ok'
import type { Chain } from '@repo/shared/constants/chains'

type ImportingState = Record<
  string,
  Record<
    Chain,
    {
      status: 'pending' | 'importing' | 'success' | 'error' | 'warning'
      message?: string
    }
  >
>

export function useImporting() {
  const router = useRouter()
  const [state, setState] = useState<ImportingState>({})

  useEffect(() => {
    const eventSource = new EventSource('/api/events/import')

    eventSource.onmessage = (event) => {
      const parsed = tryCatch(() => new Ok(JSON.parse(event.data)))
      if (!parsed.ok) {
        toast.error(parsed.message)
        return
      }
      const data = parsed.value as WalletSyncUpdate
      console.log(data)
      setState((prev) => ({
        ...prev,
        [data.wallet]: {
          ...prev[data.wallet],
          [data.chain]: data,
        },
      }))
    }

    eventSource.onerror = (err) => {
      /* router.push('/') */
    }

    return () => {
      eventSource.close()
    }
  }, [])

  return state
}
