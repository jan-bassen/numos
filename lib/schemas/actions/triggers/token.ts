import { z } from 'zod'

export type TokenEvent = z.infer<typeof tokenEventSchema>

const tokenEventSchema = z.enum(['mint', 'transfer', 'burn', 'approve'], {
  error: 'To use token trigger, you need to specify the event type',
})

export const tokenTriggerSchema = z.object({
  type: z.literal('token'),
  settings: z.object({
    event: tokenEventSchema,
  }),
})
