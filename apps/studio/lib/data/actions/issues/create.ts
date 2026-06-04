import type { ActionIssue, InsertActionIssue } from '@/types/database.types'
import { bulkPut } from '@/lib/data/store'

export async function insertActionIssues(issues: InsertActionIssue[]) {
  const base = Date.now()
  const rows: ActionIssue[] = issues.map((issue, index) => ({
    id: issue.id ?? base + index,
    action: issue.action,
    data: issue.data,
    created_at: issue.created_at ?? new Date().toISOString(),
  }))
  await bulkPut('action_issues', rows)
  return { ok: true, message: 'Issues inserted' }
}
