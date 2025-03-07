'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { NFT } from '@/db/schema/nfts'

export function NFTImage({ nft }: { nft: NFT | null }) {
  const [error, setError] = useState<string | null>(null)
  if (!nft) return null
  const imageUrl = nft.display_image_url || nft.image_url
  if (!imageUrl) return null
  if (error) return <div>{error}</div>
  return (
    <div key={nft.contract + nft.identifier}>
      <Image
        unoptimized
        src={imageUrl}
        alt={nft.name || 'NFT'}
        width={100}
        height={100}
        onError={(e) => {
          setError('Failed to load image')
        }}
      />
    </div>
  )
}
