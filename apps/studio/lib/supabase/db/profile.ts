'use server'

import type {
  InsertProfile,
  Profile,
  ReturnInfo,
  UpdateProfile,
} from '@/types/database.types'
import { createSupabaseServerComponentClient } from '../server-client'
import { revalidatePath } from 'next/cache'
import type { User } from '@supabase/supabase-js'

export async function getUser(): Promise<User> {
  const supabase = await createSupabaseServerComponentClient()
  const { data, error } = await supabase.auth.getUser()
  if (error) {
    throw new Error('Error fetching user')
  }
  return data.user
}

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

export async function updateProfile(
  userId: string,
  profile: UpdateProfile,
): Promise<ReturnInfo> {
  const supabase = await createSupabaseServerComponentClient()
  const { error } = await supabase
    .from('profiles')
    .update(profile)
    .eq('id', userId)
  if (error) {
    if (error.code === '23505') {
      return {
        ok: false,
        message: 'Username already taken, please choose another',
      }
    }
    return {
      ok: false,
      message: error.message,
    }
  }
  revalidatePath('/user', 'page')
  return {
    ok: true,
    message: 'Profile updated',
  }
}

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
  revalidatePath('/user', 'page')
  return {
    ok: true,
    message: 'Profile image updated',
  }
}
