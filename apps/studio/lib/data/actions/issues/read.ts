import type { Action, ActionIssue } from '@/types/database.types'
import { get, getAll } from '@/lib/data/store'

export async function getActionIssues(
  version: string,
): Promise<Omit<ActionIssue, 'action'>[]> {
  const issues = await getAll<ActionIssue>('action_issues')
  const result: Omit<ActionIssue, 'action'>[] = []
  for (const issue of issues) {
    const action = await get<Action>('actions', issue.action)
    if (action?.version === version) {
      const { action: _action, ...rest } = issue
      result.push(rest)
    }
  }
  return result
}
