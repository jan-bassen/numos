import { z } from 'zod'
import { bool } from 'sharp'
import {
  addressSchema,
  fullAddressSchema,
} from '@repo/engine/datatypes/schemas/datatype-schemas/address-schema'
import {
  booleanSchema,
  fullBooleanSchema,
} from '@repo/engine/datatypes/schemas/datatype-schemas/boolean-schema'
import {
  bufferSchema,
  fullBufferSchema,
} from '@repo/engine/datatypes/schemas/datatype-schemas/buffer-schema'
import {
  colorSchema,
  fullColorSchema,
} from '@repo/engine/datatypes/schemas/datatype-schemas/color-schema'
import {
  datetimeSchema,
  fullDatetimeSchema,
} from '@repo/engine/datatypes/schemas/datatype-schemas/datetime-schema'
import {
  directionSchema,
  fullDirectionSchema,
} from '@repo/engine/datatypes/schemas/datatype-schemas/direction-schema'
import {
  enumSchema,
  fullEnumSchema,
} from '@repo/engine/datatypes/schemas/datatype-schemas/enum-schema'
import {
  fullLocationSchema,
  locationSchema,
} from '@repo/engine/datatypes/schemas/datatype-schemas/location-schema'
import {
  fullNumberSchema,
  numberSchema,
} from '@repo/engine/datatypes/schemas/datatype-schemas/number-schema'
import {
  fullStringSchema,
  stringSchema,
} from '@repo/engine/datatypes/schemas/datatype-schemas/string-schema'
import {
  fullWeatherSchema,
  weatherSchema,
} from '@repo/engine/datatypes/schemas/datatype-schemas/weather-schema'
import { zDiscriminatedUnion } from '@repo/engine/datatypes/schemas/discriminated-union'

export const datatypeSchema = z.union([
  addressSchema,
  booleanSchema,
  bufferSchema,
  colorSchema,
  datetimeSchema,
  directionSchema,
  enumSchema,
  locationSchema,
  numberSchema,
  stringSchema,
  weatherSchema,
])

/* export const fullDatatypeSchema = z.discriminatedUnion('type', [
  fullAddressSchema,
  fullBooleanSchema,
  fullBufferSchema,
  fullColorSchema,
  fullDatetimeSchema,
  fullDirectionSchema,
  fullEnumSchema,
  fullLocationSchema,
  fullNumberSchema,
  fullStringSchema,
  fullWeatherSchema,
]) */

export const fullDatatypeSchema = zDiscriminatedUnion('type', [
  fullAddressSchema,
  fullBooleanSchema,
  fullBufferSchema,
  fullColorSchema,
  fullDatetimeSchema,
  fullDirectionSchema,
  fullEnumSchema,
  fullLocationSchema,
  fullNumberSchema,
  fullStringSchema,
  fullWeatherSchema,
])
