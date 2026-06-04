'use client'

import { type DependencyList, useEffect, useState } from 'react'

export type AsyncResource<T> = {
  data: T | undefined
  loading: boolean
  error: unknown
  /** Re-run the loader. */
  reload: () => void
}

/**
 * Loads data from the client store inside a component. Used by the layouts/pages
 * that used to be server components and fetched via `await`. Re-runs whenever
 * `deps` change.
 */
export function useAsyncResource<T>(
  loader: () => Promise<T>,
  deps: DependencyList,
): AsyncResource<T> {
  const [data, setData] = useState<T | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<unknown>(null)
  const [nonce, setNonce] = useState(0)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError(null)
    loader()
      .then((result) => {
        if (active) {
          setData(result)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (active) {
          setError(err)
          setLoading(false)
        }
      })
    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, nonce])

  return { data, loading, error, reload: () => setNonce((n) => n + 1) }
}
