'use client'

import { getAllCollections } from '@/lib/data/collections'
import { useAsyncResource } from '@/lib/data/use-async-resource'
import { CollectionSwitcherButton } from './collection-switcher-button'

export function CollectionSwitcher({
  collection_slug,
}: { collection_slug?: string }) {
  const { data } = useAsyncResource(() => getAllCollections(), [])
  const collections = data ?? []
  const currentCollection = collections.find((c) => c.slug === collection_slug)
  return (
    <CollectionSwitcherButton
      collections={collections}
      currentCollection={currentCollection}
    />
  )
}
