import type { ReturnInfo } from '@/types/database.types'
import type { InsertProfile } from '@/types/database.types'
import { createSupabaseServerComponentClient } from '@/lib/supabase/clients/server-client'

export async function createProfile(
  profile: InsertProfile,
): Promise<ReturnInfo> {
  const supabase = await createSupabaseServerComponentClient()
  const { error } = await supabase.from('profiles').upsert(profile).select()
  if (error) {
    return {
      ok: false,
      message: error.message || 'Error creating profile',
    }
  }
  return {
    ok: true,
    message: 'Profile created',
  }
}
