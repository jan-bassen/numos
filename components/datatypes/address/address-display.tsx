import type { OptionalValue } from '@repo/shared/types/values'
import type { GenericDisplayProps } from '../generic-display'

export type AddressDisplayProps = Omit<GenericDisplayProps, 'value'> & {
  value: OptionalValue<string>
}

export default function AddressDisplay({
  value,
  className,
}: AddressDisplayProps) {
  if (!value) return null
  return (
    <span className={className}>
      {value.slice(0, 5)}...{value.slice(-3)}
    </span>
  )
}
