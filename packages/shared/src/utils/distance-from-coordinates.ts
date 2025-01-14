import { Decimal } from 'decimal.js'
import type { Location } from '@repo/shared/types/values'

function deg2rad(deg: number) {
  return deg * (Math.PI / 180)
}

export function getDistance(
  loc1: Location,
  loc2: Location,
  unit: 'km' | 'meter' | 'mile' | 'yard' | 'nautical mile' = 'km',
) {
  const R = 6371 // Radius of the earth in km
  const dLat = deg2rad(loc2.lat - loc1.lat)
  const dLng = deg2rad(loc2.lng - loc1.lng)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(loc1.lat)) *
      Math.cos(deg2rad(loc2.lat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const km = c * R
  switch (unit) {
    case 'km':
      return new Decimal(km).toDecimalPlaces(3).toNumber()
    case 'meter':
      return new Decimal(km * 1000).toDecimalPlaces(2).toNumber()
    case 'mile':
      return new Decimal(km * 0.6213711922).toDecimalPlaces(2).toNumber()
    case 'yard':
      return new Decimal(km * 1093.6132983).toDecimalPlaces(2).toNumber()
    case 'nautical mile':
      return new Decimal(km / 1.852).toDecimalPlaces(2).toNumber()
  }
}
