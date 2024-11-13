import { getActionsForNav } from '@/lib/supabase/db/actions'
import { getAttributesForNav } from '@/lib/supabase/db/attributes'
import { getCollectionFromSlug } from '@/lib/supabase/db/collections'
import { NavCollectionItems } from './nav-collection-items'

export async function NavCollection({
  collection_slug,
}: { collection_slug: string }) {
  const collection = await getCollectionFromSlug(collection_slug)
  const version = collection.editable_version
  if (!version) throw new Error('No version')
  const attributePromise = getAttributesForNav(version)
  const actionPromise = getActionsForNav(collection.slug)
  const navItems = await Promise.all([attributePromise, actionPromise])

  return <NavCollectionItems collection={collection} navItems={navItems} />
}
