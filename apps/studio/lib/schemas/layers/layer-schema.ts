import { z } from 'zod'
import {
  sharedInsertSchema,
  sharedSlug,
  sharedUpdateSchema,
} from '@/lib/schemas/shared'
import { zDiscriminatedUnion } from '@repo/shared/schemas/discriminated-union'
import { customLayerDefinitionSchema } from '@/lib/schemas/layers/definitions/custom'
import { choiceMapLayerDefinitionSchema } from '@/lib/schemas/layers/definitions/choice-map'

export type LayerDefinition = z.infer<typeof layerDefinitionSchema>
export type LayerType = LayerDefinition['type']

export const layerDefinitionSchema = zDiscriminatedUnion(
  'type',
  [customLayerDefinitionSchema, choiceMapLayerDefinitionSchema],
  {
    invalid_union_discriminator: 'Select a layer type',
  },
)

export const newLayerSchema = z.object({
  ...sharedInsertSchema,
  slug: sharedSlug,
  definition: layerDefinitionSchema.optional(),
})

export const updateLayerSchema = z.object({
  ...sharedUpdateSchema,
  slug: sharedSlug.optional(),
  definition: layerDefinitionSchema.optional(),
})
