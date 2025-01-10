'use server'

import { FetchError } from '@/lib/errors'
import { createSupabaseServerComponentClient } from '@/lib/supabase/clients/server-client'
import { revalidatePath } from 'next/cache'
import { redirect as nextRedirect } from 'next/navigation'

export async function deleteLayer(
  id: string,
  options?: { redirect?: string; revalidate?: string },
) {
  const { redirect, revalidate } = options ?? {}
  if (!id) {
    throw new FetchError('No action defined')
  }
  const supabase = await createSupabaseServerComponentClient()
  const { error } = await supabase.from('image_layers').delete().eq('id', id)

  if (error) {
    return { ok: false, message: error.message }
  }

  if (redirect) {
    nextRedirect(redirect)
  }

  if (revalidate) {
    revalidatePath(revalidate, 'layout')
  }

  return { ok: true, message: 'Layer deleted' }
}

export async function deleteLayerBySlug(versionId: string, layerSlug: string) {
  const supabase = await createSupabaseServerComponentClient()

  const { data: layer, error: fetchError } = await supabase
    .from('image_layers')
    .select('id')
    .eq('slug', layerSlug)
    .eq('version', versionId)
    .maybeSingle()

  if (fetchError || !layer) {
    return { ok: false, message: fetchError?.message || 'Unknown layer' }
  }

  return deleteLayer(layer.id)
}
