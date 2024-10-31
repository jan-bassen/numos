import type {
  Location,
  ObjectValue,
  RawSingleValue,
  Value,
  ValueFormat,
  ValueMap,
  ValueType,
} from '@repo/engine/types/value-types'

/* export function singleDatatypeToText(data: Value<undefined, 'single'>) {
  switch (data.type) {
    case 'string':
      return data.value
    case 'number':
      return data.value.toString()
    case 'boolean':
      return data.value ? 'true' : 'false'
    case 'address':
      return data.value
    case 'color':
      return `${data.value.r}, ${data.value.g}, ${data.value.b}, ${data.value.a}`
    case 'datetime':
      return new Date(data.value).toISOString()
    case 'location':
      return `${data.value.lat.toFixed(2)}, ${data.value.lng.toFixed(2)}`
    case 'weather':
      return data.value.toLowerCase()
    case 'image':
      return data.value
    case 'buffer':
      return data.value
    case 'enum':
      return data.value
    default:
      return data.value
  }
} */

/* export function datatypeToText(value: Value) {
  if (data.list) {
    return `[${data.value
      .map((v) => {
        // @ts-ignore
        const value = asObjectArray ? v.value : v
        return singleDatatypeToText({
          type: data.type,
          list: false,
          value,
        } as NotatedSingleDataTypeValue)
      })
      .join(', ')}]`
  }
  return singleDatatypeToText(data)
} */

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

/* export function resolveListValue<Optional extends boolean = false>(
  value: Array<DatatypeObjectValue<DataTypeValue, Optional>>,
): DataTypeValue<Optional>[] {
  return value.map((v) => v.value)
} */
