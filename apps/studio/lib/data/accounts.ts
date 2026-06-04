import type { Tables } from '@/types/database.types'
import { getAll } from './store'

export async function getFirstAccountId() {
  const accounts = await getAll<Tables<'accounts'>>('accounts')
  const account = accounts[0]
  if (!account) {
    throw new Error('Error with fetching account')
  }
  return account.id
}
