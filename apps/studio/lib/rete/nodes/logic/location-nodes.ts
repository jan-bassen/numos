import type { Location } from '@/types/database.types'
import type { NodeLogicDefinitions } from '@/types/nodes.types'
import type { LocationNodeType } from '../definitions/location-nodes'
import Decimal from 'decimal.js'

function getDistance(
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

function deg2rad(deg: number) {
  return deg * (Math.PI / 180)
}

export const locationNodesLogic: NodeLogicDefinitions<LocationNodeType> = {
  'location-distance': {
    simulate: {
      outputs: {
        output: ({ inputs, controls }) => {
          const unit = controls?.unit.value as
            | 'km'
            | 'meter'
            | 'mile'
            | 'yard'
            | 'nautical mile'

          const loc1 = inputs?.loc1.value as Location
          const loc2 = inputs?.loc2.value as Location
          const distance = getDistance(loc1, loc2, unit)
          return { type: 'number', list: false, value: distance }
        },
      },
    },
  },
}
