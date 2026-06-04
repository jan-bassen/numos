import type { Profile } from '@/types/database.types'
import { get } from '@/lib/data/store'
import { createProfile } from '@/lib/data/profile/create'
import { DEMO_PROFILE } from '@/lib/data/demo-constants'

export async function getProfile(id: string): Promise<Profile> {
  const profile = await get<Profile>('profiles', id)
  if (profile) {
    return profile
  }
  // No auth backend anymore — fall back to a seeded demo profile.
  const fallback: Profile = { ...DEMO_PROFILE, id: id || DEMO_PROFILE.id }
  await createProfile(fallback)
  return fallback
}
