import { createSupabaseServerComponentClient } from '@/lib/supabase/clients/server-client'
import type { ActionIssue } from '@/types/database.types'
import 'server-only'

export async function getActionIssues(
  version: string,
): Promise<Omit<ActionIssue, 'action'>[]> {
  const supabase = await createSupabaseServerComponentClient()

  //TODO: Not working correctly, action is null when filterung with version for some goddamn reason
  const { data, error } = await supabase
    .from('action_issues')
    .select(`
        *, 
        action (
          id,
          version 
        )
      `)
    .eq('action.version', version)

  if (error) {
    throw new Error('Error with fetching issues')
  }
  return data
    .filter((issue) => issue.action !== null)
    .map((issue) => ({
      ...issue,
      action: undefined,
    }))
}
