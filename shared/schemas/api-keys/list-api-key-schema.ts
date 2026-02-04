import { z } from 'zod'

export const listApiKeySchema = z.object(
  {
    collection_id: z
      .string({
        required_error: 'Collection id needs to be provided',
        invalid_type_error: 'Collection id needs to be a string',
      })
      .uuid('Collection id needs to be a valid UUID'),
  },
  {
    required_error: 'Collection id and label need to be provided',
    invalid_type_error: 'Collection id and label need to be provided',
  },
)
