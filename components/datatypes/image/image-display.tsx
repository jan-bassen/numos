import { StorageImage } from '@/components/storage/storage-image'
import type { GenericDisplayProps } from '../generic-display'
import type { OptionalValue } from '@repo/shared/types/values'

export type ImageDisplayProps = Omit<GenericDisplayProps, 'value'> & {
  value: OptionalValue<string>
}

export default function ImageDisplay({ value, ...props }: ImageDisplayProps) {
  if (!value) return null
  return (
    <StorageImage
      src={`user-images/${value}`}
      className="size-full"
      width={160}
      height={160}
      alt="Image"
    />
  )
}
