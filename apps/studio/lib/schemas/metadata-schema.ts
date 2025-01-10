import { explicitlyValidateValue } from '@repo/shared/schemas/datatypes/validation'
import type { SimulationData } from '@repo/engine/types/engine-types'
import { z } from 'zod'
import { integerSchema } from '@repo/shared/schemas/datatypes/datatype-schemas/number-schema'
import { stringSchema } from '@repo/shared/schemas/datatypes/datatype-schemas/string-schema'

export const metadataSchema = z.object({
  id: integerSchema.min(0, 'Must be positive'),
  name: stringSchema,
  description: stringSchema,
})

export const optionalMetadataSchema = z
  .object({
    id: integerSchema.min(0, 'Must be positive').nullable().optional(),
    name: stringSchema.nullable().optional(),
    description: stringSchema.nullable().optional(),
  })
  .nullable()
  .optional()

export function annotateMetadata(
  metadata?: z.infer<typeof optionalMetadataSchema>,
): SimulationData['basicMetadata'] {
  const data = metadata
    ? metadata
    : {
        id: undefined,
        name: undefined,
        description: undefined,
      }

  const idRes = data.id
    ? explicitlyValidateValue<'number', 'single', false>(
        'number',
        'single',
        false,
        {
          type: 'number',
          format: 'single',
          value: data.id,
        },
      )
    : undefined

  if (idRes?.error) throw new Error('Error with parsing id')
  const id = idRes?.validated ? idRes.validated : undefined

  const nameRes = data.name
    ? explicitlyValidateValue<'string', 'single', false>(
        'string',
        'single',
        false,
        {
          type: 'string',
          format: 'single',
          value: data.name,
        },
      )
    : undefined

  if (nameRes?.error) throw new Error('Error with parsing name')
  const name = nameRes?.validated ? nameRes.validated : undefined

  const descriptionRes = data.description
    ? explicitlyValidateValue<'string', 'single', false>(
        'string',
        'single',
        false,
        { type: 'string', format: 'single', value: data.description },
      )
    : undefined

  if (descriptionRes?.error) throw new Error('Error with parsing description')
  const description = descriptionRes?.validated
    ? descriptionRes.validated
    : undefined
  return {
    id,
    name,
    description,
  }
}
