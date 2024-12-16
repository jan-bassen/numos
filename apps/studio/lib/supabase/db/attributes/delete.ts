import type { ReturnInfo } from '@repo/ui/lib/utils'
import { clearAttributeNodeControls } from '@/lib/supabase/db/attributes/nodes/update'
import { createSupabaseServerComponentClient } from '@/lib/supabase/clients/server-client'
import { revalidatePath } from 'next/cache'

export async function deleteAttribute(
  attributeId: string,
): Promise<ReturnInfo> {
  if (!attributeId) {
    return { ok: false, message: 'Unknown attribute' }
  }

  const supabase = await createSupabaseServerComponentClient()

  const { error } = await supabase
    .from('attributes')
    .delete()
    .eq('id', attributeId)

  if (error) {
    return { ok: false, message: error.message }
  }
  const res = await clearAttributeNodeControls(attributeId)
  revalidatePath('/collections/[collection]/attributes')
  return res
}

export async function deleteAttributeBySlug(
  versionId: string,
  attributeSlug: string,
) {
  const supabase = await createSupabaseServerComponentClient()

  const { data: attribute, error: fetchError } = await supabase
    .from('attributes')
    .select('id')
    .eq('slug', attributeSlug)
    .eq('version', versionId)
    .maybeSingle()

  if (fetchError || !attribute) {
    return { ok: false, message: fetchError?.message || 'Unknown attribute' }
  }

  return deleteAttribute(attribute.id)
}
