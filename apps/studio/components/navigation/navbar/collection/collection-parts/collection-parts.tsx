import { getActionsForNav } from '@/lib/supabase/db/actions'
import { getCollectionFromSlug } from '@/lib/supabase/db/collections'
import { CollectionItems } from './collection-items'
import { getAttributesForNav } from '@/lib/supabase/db/attributes/read'
import { getLayersForNav } from '@/lib/supabase/db/layers/read'

export async function CollectionParts({
  collection_slug,
}: { collection_slug: string }) {
  const collection = await getCollectionFromSlug(collection_slug)
  const version = collection.editable_version
  if (!version) throw new Error('No version')
  const attributePromise = getAttributesForNav(version)
  const actionPromise = getActionsForNav(collection.slug)
  const layerPromise = getLayersForNav(collection.slug)
  const navItems = await Promise.all([
    attributePromise,
    actionPromise,
    layerPromise,
  ])

  return <CollectionItems collection={collection} navItems={navItems} />
}
