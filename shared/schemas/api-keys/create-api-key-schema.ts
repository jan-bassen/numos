import { z } from 'zod'

export const apiKeyRequestSchema = z.object(
  {
    collection_id: z
      .string({
        error: 'Collection id needs to be a string',
      })
      .uuid('Collection id needs to be a valid UUID'),
    label: z
      .string({
        error: 'Label needs to be a string',
      })
      .min(1, 'Label needs to be provided')
      .max(50, 'Label is too long'),
  },
  {
    error: 'Collection id and label need to be provided',
  },
)
