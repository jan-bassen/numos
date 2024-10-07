'use client' // Error components must be Client Components

import GeneralError from '@repo/ui/components/errors/general-error'
import { useEffect } from 'react'

export default function AttributesError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return <GeneralError resetFunction={reset} error={error} />
}
