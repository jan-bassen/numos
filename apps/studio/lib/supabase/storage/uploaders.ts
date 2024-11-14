'use client'

import type { ReturnInfo } from '@/types/database.types'
import { createSupabaseClient } from '../clients/client'
import { toast } from 'sonner'
import { handleReturnInfo } from '@repo/ui/lib/utils'

export async function uploadAvatar(file: File) {
  const uuid = crypto.randomUUID()
  const supabase = await createSupabaseClient()
  const { data: userRes } = await supabase.auth.getUser()
  if (!userRes.user) {
    toast.error('Error fetching user')
    return
  }
  const fullPath = `${uuid}`
  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(fullPath, file)
  if (uploadError) {
    toast.error('Error uploading avatar')
    return
  }
  const { error: updateError } = await supabase
    .from('profiles')
    .update({
      avatar_url: uuid,
    })
    .eq('id', userRes.user.id)
  if (updateError) {
    console.error(updateError)
    const { error } = await supabase.storage.from('avatars').remove([fullPath])
    if (error) {
      throw error
    }
    toast.error('Error updating avatar')
    return
  }
  return uuid
}

export type StorageLocation = {
  bucket: string
  path?: string
  name: string
}

export const uploadFile = async (
  location: StorageLocation,
  file: File,
  updateFunction?: (fullPath: string) => Promise<ReturnInfo>,
  replacing?: string,
) => {
  const fullPath = location.path ? location.path + location.name : location.name
  const supabase = await createSupabaseClient()
  const { data, error: uploadError } = await supabase.storage
    .from(location.bucket)
    .upload(fullPath, file)
  if (uploadError) {
    toast.error(`Error uploading image: ${uploadError.message}`)
    return
  }
  if (updateFunction) {
    const res = await updateFunction(data.path)
    handleReturnInfo(
      res,
      () => {},
      async () => {
        const { error: removeError } = await supabase.storage
          .from(location.bucket)
          .remove([fullPath])
        if (removeError) {
          toast.error('Error removing image')
        }
      },
    )
  }
  if (replacing) {
    const { data, error: removeError } = await supabase.storage
      .from(location.bucket)
      .remove([replacing])
    console.log(data, removeError)
    if (removeError) {
      toast.error('Error removing old image')
    }
  }
  return data.path
}
