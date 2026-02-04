import { z } from 'zod'
import {
  addressSchema,
  fullAddressSchema,
} from '@repo/shared/schemas/datatypes/datatype-schemas/address-schema'
import {
  booleanSchema,
  fullBooleanSchema,
} from '@repo/shared/schemas/datatypes/datatype-schemas/boolean-schema'
import {
  bufferSchema,
  fullBufferSchema,
} from '@repo/shared/schemas/datatypes/datatype-schemas/buffer-schema'
import {
  colorSchema,
  fullColorSchema,
} from '@repo/shared/schemas/datatypes/datatype-schemas/color-schema'
import {
  datetimeSchema,
  fullDatetimeSchema,
} from '@repo/shared/schemas/datatypes/datatype-schemas/datetime-schema'
import {
  directionSchema,
  fullDirectionSchema,
} from '@repo/shared/schemas/datatypes/datatype-schemas/direction-schema'
import {
  enumSchema,
  fullEnumSchema,
} from '@repo/shared/schemas/datatypes/datatype-schemas/enum-schema'
import {
  fullLocationSchema,
  locationSchema,
} from '@repo/shared/schemas/datatypes/datatype-schemas/location-schema'
import {
  fullNumberSchema,
  numberSchema,
} from '@repo/shared/schemas/datatypes/datatype-schemas/number-schema'
import {
  fullStringSchema,
  stringSchema,
} from '@repo/shared/schemas/datatypes/datatype-schemas/string-schema'
import {
  fullWeatherSchema,
  weatherSchema,
} from '@repo/shared/schemas/datatypes/datatype-schemas/weather-schema'
import {
  fullImageSchema,
  imageSchema,
} from '@repo/shared/schemas/datatypes/datatype-schemas/image-schema'
import { zDiscriminatedUnion } from '@repo/shared/schemas/discriminated-union'
import type { ValueType } from '@repo/shared/types/values'

export const datatypeSchema = z.union([
  addressSchema,
  booleanSchema,
  bufferSchema,
  colorSchema,
  datetimeSchema,
  directionSchema,
  enumSchema,
  imageSchema,
  locationSchema,
  numberSchema,
  stringSchema,
  weatherSchema,
])

export type FullValue = z.infer<typeof fullDatatypeSchema>

export const fullDatatypeSchema = zDiscriminatedUnion('type', [
  fullAddressSchema,
  fullBooleanSchema,
  fullBufferSchema,
  fullColorSchema,
  fullDatetimeSchema,
  fullDirectionSchema,
  fullEnumSchema,
  fullLocationSchema,
  fullImageSchema,
  fullNumberSchema,
  fullStringSchema,
  fullWeatherSchema,
])

export const datatypeSchemasMap: Record<ValueType, z.ZodType> = {
  number: numberSchema,
  string: stringSchema,
  boolean: booleanSchema,
  color: colorSchema,
  location: locationSchema,
  direction: directionSchema,
  weather: weatherSchema,
  address: addressSchema,
  image: stringSchema,
  datetime: datetimeSchema,
  buffer: bufferSchema,
  enum: enumSchema,
}
