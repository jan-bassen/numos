import { z } from 'zod'

const osNftSchema = z.object({
  identifier: z.string(), //--
  collection: z.string(), //--
  contract: z.string(), //--
  token_standard: z.string(), //--
  name: z.string(), //--
  description: z.string(), //--
  image_url: z.string().url().nullable().optional(), //--
  display_image_url: z.string().url().nullable().optional(), // +++
  display_animation_url: z.string().url().nullable().optional(), // +++
  metadata_url: z.string().url().nullable().optional(), //--
  opensea_url: z.string().url().nullable().optional(), // +++
  updated_at: z.date(), // +++
  is_disabled: z.boolean(), // +++
  is_nsfw: z.boolean(), // +++
})

export default osNftSchema
