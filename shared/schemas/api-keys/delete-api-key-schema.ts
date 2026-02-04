import { z } from 'zod'

export const apiKeyDeleteSchema = z.object({
  id: z.string().uuid(),
})
