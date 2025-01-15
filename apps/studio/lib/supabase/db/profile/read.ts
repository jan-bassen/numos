'use server'

import 'server-only'

import type { InsertProfile } from '@/types/database.types'
import type { Profile } from '@/types/database.types'
import { createSupabaseServerComponentClient } from '@/lib/supabase/clients/server-client'
import { createProfile } from '@/lib/supabase/db/profile/create'

export async function getProfile(id: string): Promise<Profile> {
  const supabase = await createSupabaseServerComponentClient()
  const { data, error } = await supabase
    .from('profiles')
    .select()
    .eq('id', id)
    .single()

  if (error) {
    throw new Error('Error fetching profile')
  }
  if (!data) {
    const { data, error } = await supabase.auth.getUser()
    if (error) {
      throw new Error('Error fetching user')
    }
    const newProfile: InsertProfile = {
      id: data.user.id,
      full_name: data.user.user_metadata.name || null,
      username: data.user.user_metadata.name || null,
      avatar_url: data.user.user_metadata.avatar_url || null,
    }
    const res = await createProfile(newProfile)
    if (!res.ok) {
      throw new Error('Error creating profile')
    }
  }
  return data
}
