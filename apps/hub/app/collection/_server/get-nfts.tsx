import { db } from '@/db/client'
import { wallets } from '@/db/schemas/wallets'
import { nfts as nftsTable } from '@/db/schemas/nfts'
import { getUser } from '@/server/auth/get-user'
import { Ok } from '@repo/shared/result/ok'
import { tryCatchAsync } from '@repo/shared/result/try'
import { eq, and, sql } from 'drizzle-orm'
import { unauthorized } from 'next/navigation'

export type ExtendedNft = Awaited<
  ReturnType<typeof fetchNfts>
>[number]['nfts'][number]

async function fetchNfts(userId: string) {
  return await db.query.wallets.findMany({
    where: and(eq(wallets.userId, userId), eq(wallets.active, true)),
    columns: {},
    with: {
      nfts: {
        limit: 100,
        where: sql`${nftsTable.alchemyRawMetadata}->'metadata'->>'name' IS NOT NULL`,
        with: {
          collection: true,
        },
      },
    },
  })
}

export async function getNfts() {
  const user = await getUser()
  if (!user) {
    unauthorized()
  }
  return await tryCatchAsync(
    async () => {
      const nfts = await fetchNfts(user.id)
      const flatNfts = nfts.flatMap((wallet) => wallet.nfts)
      const filteredNfts = flatNfts.filter(
        (nft) => nft.collection.spam?.spam === false,
      )
      return new Ok(filteredNfts)
    },
    (err) => {
      console.error(err)
    },
  )
}
