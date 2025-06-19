'use client'

import GeneralError from '@repo/ui/blocks/errors/general-error'
import { useEffect } from 'react'

export default function ActionError({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  useEffect(() => {
    // Add logging
    console.error(error)
  }, [error])

  return <GeneralError resetFunction={reset} error={error} />
}
