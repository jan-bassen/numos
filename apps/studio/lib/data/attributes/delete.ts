import type { ReturnInfo } from '@repo/ui/lib/utils'
import type { Attribute } from '@/types/database.types'
import { clearAttributeNodeControls } from '@/lib/data/attributes/nodes/update'
import { getAllBy, remove } from '@/lib/data/store'
import { redirect as nextRedirect } from 'next/navigation'

export async function deleteAttribute(
  attributeId: string,
  redirect?: string,
): Promise<ReturnInfo> {
  if (!attributeId) {
    return { ok: false, message: 'Unknown attribute' }
  }

  const res = await clearAttributeNodeControls(attributeId)
  await remove('attributes', attributeId)

  if (redirect) {
    nextRedirect(redirect)
  }
  return res
}

export async function deleteAttributeBySlug(
  versionId: string,
  attributeSlug: string,
) {
  const attributes = await getAllBy<Attribute>(
    'attributes',
    'version',
    versionId,
  )
  const attribute = attributes.find((a) => a.slug === attributeSlug)
  if (!attribute) {
    return { ok: false, message: 'Unknown attribute' }
  }
  return deleteAttribute(attribute.id)
}
