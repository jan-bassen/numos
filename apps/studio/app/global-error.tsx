'use client' // Error components must be Client Components

import { useEffect } from 'react'
/* import * as Sentry from "@sentry/nextjs"; */

export default function GlobalError({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  useEffect(() => {
    /* Sentry.captureException(error); */
  }, [])

  return (
    <html lang="en">
      <body>
        <div>
          <h2>Something went wrong!</h2>
          <button
            type="button"
            onClick={
              // Attempt to recover by trying to re-render the segment
              () => reset()
            }
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
