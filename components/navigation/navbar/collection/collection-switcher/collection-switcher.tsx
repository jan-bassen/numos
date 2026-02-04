import { getAllCollections } from '@/lib/supabase/db/collections'
import { CollectionSwitcherButton } from './collection-switcher-button'

export async function CollectionSwitcher({
  collection_slug,
}: { collection_slug?: string }) {
  const collections = await getAllCollections()
  const currentCollection = collections.find((c) => c.slug === collection_slug)
  return (
    <CollectionSwitcherButton
      collections={collections}
      currentCollection={currentCollection}
    />
  )
}
