import { FetchError } from '@/lib/errors'
import { createSupabaseServerComponentClient } from '@/lib/supabase/clients/server-client'
import { redirect as nextRedirect } from 'next/navigation'

export async function deleteAction(id: string, redirect?: string) {
  if (!id) {
    throw new FetchError('No action defined')
  }
  const supabase = await createSupabaseServerComponentClient()
  const { error } = await supabase.from('actions').delete().eq('id', id)

  if (error) {
    throw new FetchError('Error with deleting action')
  }
  if (redirect) {
    nextRedirect(redirect)
  }
}
