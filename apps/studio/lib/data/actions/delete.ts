import { FetchError } from '@/lib/errors'
import { remove } from '@/lib/data/store'
import { redirect as nextRedirect } from 'next/navigation'

export async function deleteAction(id: string, redirect?: string) {
  if (!id) {
    throw new FetchError('No action defined')
  }
  await remove('actions', id)

  if (redirect) {
    nextRedirect(redirect)
  }
  return { ok: true, message: 'Action deleted' }
}
