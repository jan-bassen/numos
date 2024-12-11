import type { WeatherCode } from '@/types/database.types'
import type { GenericDisplayProps } from '../generic-display'
import { weatherConditions } from '@/lib/constants/weather'
import type { OptionalValue } from '@repo/engine/types/value-types'

export type WeatherDisplayProps = Omit<GenericDisplayProps, 'value'> & {
  value: OptionalValue<WeatherCode>
}

export default function WeatherDisplay({
  value,
  className,
}: WeatherDisplayProps) {
  if (!value) return null
  return <span className={className}>{weatherConditions[value]?.name}</span>
}
