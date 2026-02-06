import { z } from 'zod'

export const listApiKeySchema = z.object(
  {
    collection_id: z
      .string({
        error: 'Collection id needs to be a string',
      })
      .uuid('Collection id needs to be a valid UUID'),
  },
  {
    error: 'Collection id and label need to be provided',
  },
)
