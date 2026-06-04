'use client'

import { getActionsForNav } from '@/lib/data/actions'
import { getCollectionFromSlug } from '@/lib/data/collections'
import { CollectionItems } from './collection-items'
import { getAttributesForNav } from '@/lib/data/attributes/read'
import { getLayersForNav } from '@/lib/data/layers/read'
import { useAsyncResource } from '@/lib/data/use-async-resource'
import type { NavItems } from '@/components/navigation/navbar/navbar'

export function CollectionParts({
  collection_slug,
}: { collection_slug: string }) {
  const { data: collection } = useAsyncResource(
    () => getCollectionFromSlug(collection_slug),
    [collection_slug],
  )
  const version = collection?.editable_version

  const { data: navItems } = useAsyncResource<NavItems>(
    () =>
      version
        ? Promise.all([
            getAttributesForNav(version),
            getActionsForNav(collection.slug),
            getLayersForNav(collection.slug),
          ])
        : Promise.resolve([[], [], []] as NavItems),
    [version, collection?.slug],
  )

  if (!collection || !version || !navItems) return null

  return <CollectionItems collection={collection} navItems={navItems} />
}
