import type { InsertProfile, Profile, ReturnInfo } from '@/types/database.types'
import { put } from '@/lib/data/store'

export async function createProfile(
  profile: InsertProfile,
): Promise<ReturnInfo> {
  await put<Profile>('profiles', {
    id: profile.id,
    full_name: profile.full_name ?? null,
    username: profile.username ?? null,
    avatar_url: profile.avatar_url ?? null,
    updated_at: new Date().toISOString(),
  })
  return { ok: true, message: 'Profile created' }
}
