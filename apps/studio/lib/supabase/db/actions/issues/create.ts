import { createSupabaseServerComponentClient } from '@/lib/supabase/clients/server-client'
import type { InsertActionIssue } from '@/types/database.types'
import { revalidatePath } from 'next/cache'

export async function insertActionIssues(issues: InsertActionIssue[]) {
  const supabase = await createSupabaseServerComponentClient()
  const { error } = await supabase.from('action_issues').insert(issues)
  if (error) {
    return { ok: false, message: 'Error with inserting issues' }
  }
  revalidatePath('/collections/[collection]/testing')
  return { ok: true, message: 'Issues inserted' }
}
