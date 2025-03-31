'use server'

import { db } from '@/db/client'
import type { AddressInfo } from '@/app/(start)/_server/resolve-address'
import { Err } from '@repo/shared/result/err'
import {
  type Wallet,
  type WalletInsert,
  walletInsertSchema,
  wallets,
} from '@/db/schemas/wallets'
import { Ok } from '@repo/shared/result/ok'
import { type SerializedResponse, tryCatchAsync } from '@repo/shared/result/try'
import { getUser } from '@/server/auth/get-user'

export async function importWallets(
  addresses: AddressInfo[],
): Promise<SerializedResponse<Wallet[]>> {
  const res = await tryCatchAsync(async () => {
    const user = await getUser()
    if (!user) {
      return new Err('Unauthorized', 'unauthorized', {
        internalMessage:
          'Should be logged in at least as anonymous user, but is not',
      })
    }

    const userId = user.id

    const errors: Err<'validation'>[] = []

    const insertWallets: WalletInsert[] = addresses
      .map((address) => {
        const wallet: WalletInsert = {
          address: address.address.toLowerCase(),
          humanReadable: address.humanReadable,
          shortAddress: address.shortAddress,
          type: address.type,
          userId,
        }

        const result = walletInsertSchema.safeParse(wallet)

        if (result.success) {
          return result.data
        }
        errors.push(Err.fromZodError(result.error))
        return undefined
      })
      .filter((w) => w !== undefined)

    if (insertWallets.length !== addresses.length) {
      return new Err('Failed to import wallets', 'unknown', {
        internalMessage: 'No wallets inserted, some might be invalid',
      })
    }

    const result = await db
      .insert(wallets)
      .values(insertWallets)
      .onConflictDoNothing()
      .returning()

    if (result.length !== addresses.length) {
      return new Err('Failed to import wallets', 'dbInsert', {
        internalMessage: 'Failed to import wallets',
      })
    }

    return new Ok(result)
  })
  return res.toSerializedResponse()
}
