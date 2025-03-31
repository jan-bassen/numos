import { getNfts } from '@/app/collection/_server/get-nfts'
import { Nft } from '@/app/collection/_components/nft'

export default async function Collection() {
  const res = await getNfts()
  if (!res.ok) {
    return <div>Error</div>
  }
  return (
    <div className="grid w-full grid-cols-2 gap-4 p-4 md:grid-cols-3 lg:grid-cols-4">
      {res.value.map((nft) => {
        return <Nft key={nft.id} nft={nft} />
      })}
    </div>
  )
}
