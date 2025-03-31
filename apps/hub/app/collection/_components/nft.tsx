'use client'

import { Card } from '@repo/ui/components/card'
import type { ExtendedNft } from '@/app/collection/_server/get-nfts'
import { NftImage } from './nft-image'

export function Nft({
  nft,
}: {
  nft: ExtendedNft
}) {
  return (
    <Card className="flex flex-col gap-2 overflow-hidden p-0">
      <NftImage nft={nft} />

      <div className="flex flex-col gap-1 p-2">
        <div className="font-medium text-sm">{nft.name}</div>
        <div className="line-clamp-2 max-h-12 overflow-ellipsis text-gray-500 text-sm">
          {nft.description}
        </div>
        <div className="text-gray-500 text-sm">{nft.collection.name}</div>
        <div className="text-gray-500 text-sm">{nft.collection.chain}</div>
      </div>
    </Card>
  )
}
