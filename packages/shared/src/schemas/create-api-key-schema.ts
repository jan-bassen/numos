import { z } from 'zod'

export const apiKeyRequestSchema = z.object(
  {
    collection_id: z
      .string({
        required_error: 'Collection id needs to be provided',
        invalid_type_error: 'Collection id needs to be a string',
      })
      .uuid('Collection id needs to be a valid UUID'),
    label: z
      .string({
        required_error: 'Label needs to be provided',
        invalid_type_error: 'Label needs to be a string',
      })
      .min(1, 'Label needs to be provided')
      .max(50, 'Label is too long'),
  },
  {
    required_error: 'Collection id and label need to be provided',
    invalid_type_error: 'Collection id and label need to be provided',
  },
)
