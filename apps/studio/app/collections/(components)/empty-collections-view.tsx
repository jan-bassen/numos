import { PiDiamondComponentStroke } from '@repo/ui/icons/pika'

export default function EmptyCollectionsView({
  children,
  className,
}: {
  children?: React.ReactNode
  className?: string
}) {
  return (
    <div className="flex min-h-52 gap-5">
      <PiDiamondComponentStroke className="mt-2 size-10 text-border" />
      <div className="space-y-4">
        <div className="max-w-96 space-y-0.5">
          <h3 className="font-semibold text-lg">
            Create your first collection
          </h3>
          <p className="text-sm">
            Analog to what you know as an ERC721 NFT collection, they encompass
            tokens with a unique set of traits, images and other metadata.
          </p>
        </div>
        {children}
      </div>
    </div>
  )
}
