import type { OptionalValue } from '@repo/shared/types/values'
import type { GenericDisplayProps } from '../generic-display'

export type DateTimeDisplayProps = Omit<GenericDisplayProps, 'value'> & {
  value: OptionalValue<number>
}

export default function DateTimeDisplay({
  value,
  className,
}: DateTimeDisplayProps) {
  if (!value) return null
  const string = new Date(value).toLocaleString()
  return <span className={className}>{string}</span>
}
