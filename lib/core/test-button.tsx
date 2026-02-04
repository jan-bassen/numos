'use client'

import { Button } from '@repo/ui/components/button'
import { createApiKey } from './api/create-api-key'

export default function TestButton() {
  return (
    <Button
      onClick={() => {
        createApiKey({
          collection_id: '1e3116db-9cf2-4305-bc50-3ab5e8d14468',
          label: 'test',
        })
      }}
    >
      Test
    </Button>
  )
}
