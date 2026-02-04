import { z } from 'zod'

export const profileSchema = z.object({
  id: z.string().uuid().optional(),
  updated_at: z.never().optional(),
  full_name: z.string().optional(),
  avatar_url: z.string().optional(),
})

export const updateProfileSchema = z.object({
  id: z.never().optional(),
  updated_at: z.never().optional(),
  full_name: z.string().optional(),
  avatar_url: z.string().optional(),
})
