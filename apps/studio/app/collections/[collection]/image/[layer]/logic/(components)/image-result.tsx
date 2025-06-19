import LoadingSpinner from '@repo/ui/blocks/loading/loading-spinner'
import Image from 'next/image'

export default function ImageResult({
  result,
  loading,
}: {
  result?: string
  loading?: boolean
}) {
  if (loading && !result) return <LoadingSpinner containerClassName="!h-80" />
  if (!result) return null
  return (
    <div className="w-full object-contain">
      <Image
        src={
          result
            ? `data:image/jpeg;base64,${result}`
            : '/images/placeholder.png'
        }
        alt="Result"
        className="w-full"
        width={320}
        height={320}
      />
    </div>
  )
}
