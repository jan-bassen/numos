import type { Location } from '@repo/shared/types/values'

export function getAddressFromGeocoder(
  geodata: any[],
  location: Location,
): { short: string; long: string } {
  const addressComponents = geodata[0].address_components
  const street = addressComponents.find((c: any) => c.types.includes('route'))

  const locality = addressComponents.find((c: any) =>
    c.types.includes('locality'),
  )
  const country = addressComponents.find((c: any) =>
    c.types.includes('country'),
  )

  const shortAddress =
    locality && country
      ? `${locality.long_name}, ${country.short_name}`
      : country
        ? country.short_name
        : locality
          ? locality.short_name
          : `${location.lat.toFixed(4)}, ${location.lat.toFixed(4)}`

  const longAddress =
    street || locality || country
      ? `${street ? `${street.long_name}, ` : ''}${locality ? `${locality.long_name}, ` : ''}${country ? country.long_name : ''}`
      : `${location.lat.toFixed(6)}, ${location.lat.toFixed(6)}`
  return { short: shortAddress, long: longAddress }
}
