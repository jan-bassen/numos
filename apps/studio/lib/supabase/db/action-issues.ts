'use server'

import type { InsertActionIssue } from '@/types/database.types'
import { createSupabaseServerComponentClient } from '../clients/server-client'
import { revalidatePath } from 'next/cache'

export async function getActionIssues(action: string) {
  const supabase = await createSupabaseServerComponentClient()
  const { data, error } = await supabase
    .from('action_issues')
    .select()
    .eq('action', action)
  if (error) {
    throw new Error('Error with fetching issues')
  }
  return data
}

export async function insertActionIssues(issues: InsertActionIssue[]) {
  const supabase = await createSupabaseServerComponentClient()
  const { error } = await supabase.from('action_issues').insert(issues)
  if (error) {
    return { ok: false, message: 'Error with inserting issues' }
  }
  revalidatePath('/collections/[collection]/testing')
  return { ok: true, message: 'Issues inserted' }
}
