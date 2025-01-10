import { z } from 'zod'

export const choiceMapLayerDefinitionSchema = z.object({
  type: z.literal('choice-map'),
})
