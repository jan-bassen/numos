import { z } from 'zod'

export const customLayerDefinitionSchema = z.object({
  type: z.literal('custom'),
})
