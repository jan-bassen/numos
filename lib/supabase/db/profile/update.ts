'use server'

import 'server-only'

import type { ReturnInfo, UpdateProfile } from '@/types/database.types'
import { createSupabaseServerComponentClient } from '@/lib/supabase/clients/server-client'
import { createSafeUpdate } from '@/lib/supabase/db/create-safe-update'
import { updateProfileSchema } from '@/lib/schemas/profile/profile-schema'
import { revalidatePath } from 'next/cache'

export async function updateProfileBase(id: string, values: UpdateProfile) {
  const supabase = await createSupabaseServerComponentClient()

  const { error } = await supabase.from('profiles').update(values).eq('id', id)
  if (error) {
    console.log(error)
    return { ok: false, message: error.message }
  }
  console.log('Profile updated')
  return { ok: true, message: 'Profile updated' }
}

export const updateProfile = createSafeUpdate<UpdateProfile>(
  updateProfileBase,
  updateProfileSchema,
)

// TODO: remove
export async function updateProfileImage(
  userId: string,
  image: string,
): Promise<ReturnInfo> {
  const supabase = await createSupabaseServerComponentClient()
  const { error } = await supabase
    .from('profiles')
    .update({ avatar_url: image })
    .eq('id', userId)
  if (error) {
    return {
      ok: false,
      message: error.message,
    }
  }
  revalidatePath('/account', 'page')
  return {
    ok: true,
    message: 'Profile image updated',
  }
}
