'use client'

import { updateIssues } from '@/lib/validation/update-issues'
import { Button } from '@repo/ui/components/button'
import { PiRefreshStroke, PiSearchBigStroke } from '@repo/ui/icons/pika'

export default function IssuesButton({
  version,
  hasIssues,
}: { version: string; hasIssues: boolean }) {
  return (
    <Button className="gap-1.5" onClick={() => updateIssues(version)}>
      {!hasIssues ? (
        <>
          <PiSearchBigStroke className="size-4" />
          Check for issues
        </>
      ) : (
        <>
          <PiRefreshStroke className="size-4" />
          Refresh issues
        </>
      )}
    </Button>
  )
}
