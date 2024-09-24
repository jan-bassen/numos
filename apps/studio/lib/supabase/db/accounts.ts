'use server'

import { createSupabaseServerComponentClient } from '../server-client'

export async function getFirstAccountId() {
  const supabase = await createSupabaseServerComponentClient()
  const { data, error } = await supabase
    .from('accounts')
    .select('id')
    .maybeSingle()
  if (error || !data) {
    throw new Error('Error with fetching account')
  }
  return data.id
}
