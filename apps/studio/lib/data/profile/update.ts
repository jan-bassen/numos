import type { Profile, ReturnInfo, UpdateProfile } from '@/types/database.types'
import { createSafeUpdate } from '@/lib/data/create-safe-update'
import { updateProfileSchema } from '@/lib/schemas/profile/profile-schema'
import { patch } from '@/lib/data/store'

export async function updateProfileBase(id: string, values: UpdateProfile) {
  const updated = await patch<Profile>('profiles', id, values)
  if (!updated) {
    return { ok: false, message: 'Profile not found' }
  }
  return { ok: true, message: 'Profile updated' }
}

export const updateProfile = createSafeUpdate<UpdateProfile>(
  updateProfileBase,
  updateProfileSchema,
)

export async function updateProfileImage(
  userId: string,
  image: string,
): Promise<ReturnInfo> {
  const updated = await patch<Profile>('profiles', userId, {
    avatar_url: image,
  })
  if (!updated) {
    return { ok: false, message: 'Profile not found' }
  }
  return { ok: true, message: 'Profile image updated' }
}
