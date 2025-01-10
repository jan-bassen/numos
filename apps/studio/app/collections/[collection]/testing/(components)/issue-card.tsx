import type { ValidationIssueData } from '@repo/engine/types/validation-types'
import { Card } from '@repo/ui/components/ui/card'
import type { ComponentProps } from 'react'

export default function ActionIssueCard({
  issue,
}: ComponentProps<'div'> & { issue: ValidationIssueData }) {
  return (
    <Card className="flex flex-col gap-2 border border-border p-4">
      <h3>{issue.message}</h3>
    </Card>
  )
}
