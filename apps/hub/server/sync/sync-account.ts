'use server'

import 'server-only'
import type { User } from 'better-auth/types'
import { db } from '@/db/client'
import { and, eq } from 'drizzle-orm'
import { wallets } from '@/db/schemas/wallets'
import { tryCatchAsync } from '@repo/shared/result/try'
import { Ok } from '@repo/shared/result/ok'
import { Err } from '@repo/shared/result/err'
import { syncs } from '@/db/schemas/syncs'
import { supportedChains } from '@repo/shared/constants/chains'
import { syncChain } from '@/server/sync/sync-chain'
import { getUser } from '@/server/auth/get-user'

export async function syncAccount() {
  const user = await getUser()
  if (!user) {
    throw new Error('User not found')
  }

  /* const sync = await tryCatchAsync(async () => {
    const sync = await db.insert(syncs).values({
      user: user.id,
      status: 'syncing',
    })

    return new Ok(sync[0] ?? null)
  })

  if (!sync.ok) {
    return new Err(sync.message).toSerializedResponse()
  } */

  const userWallets = await db.query.wallets.findMany({
    where: and(eq(wallets.userId, user.id), eq(wallets.active, true)),
  })

  return (await syncChain('ethereum', userWallets)).toSerializedResponse()

  /* for (const chain of supportedChains) {
    await syncChain(chain, userWallets)
  } */
}
