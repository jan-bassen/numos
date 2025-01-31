'use server'

import { FetchError } from '@/lib/errors'
import { createSupabaseServerComponentClient } from '@/lib/supabase/clients/server-client'
import { redirect as nextRedirect } from 'next/navigation'

export async function deleteAction(id: string, redirect?: string) {
  if (!id) {
    throw new FetchError('No action defined')
  }
  console.log('delete')
  const supabase = await createSupabaseServerComponentClient()
  const { data, error } = await supabase.from('actions').delete().eq('id', id)
  if (error) {
    return {
      ok: false,
      message: error.message || 'Error with deleting action',
    }
  }

  if (redirect) {
    nextRedirect(redirect)
  }
  return {
    ok: true,
    message: 'Action deleted',
  }
}
