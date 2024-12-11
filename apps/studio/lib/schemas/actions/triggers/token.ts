import { z } from 'zod'

export const tokenTriggerSchema = z.object({
  type: z.literal('token'),
  event: z.enum(['mint', 'transfer', 'burn', 'approve'], {
    required_error: 'To use token trigger, you need to specify the event type',
  }),
})
