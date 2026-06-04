'use client'

import { useParams } from 'next/navigation'
import { useAsyncResource } from '@/lib/data/use-async-resource'
import { Navbar } from '@/components/navigation/navbar/navbar'
import { getExtendedCollectionFromSlug } from '@/lib/data/collections'
import { CollectionProvider } from '@/app/collections/[collection]/collection-context'
import { VersionProvider } from '@/app/collections/[collection]/version-context'

export default function Layout({ children }: { children: React.ReactNode }) {
  const { collection: collectionSlug } = useParams<{ collection: string }>()
  const { data: extended_collection } = useAsyncResource(
    () => getExtendedCollectionFromSlug(collectionSlug),
    [collectionSlug],
  )

  if (!extended_collection || !extended_collection.editable_version) {
    return null
  }

  const version = extended_collection.editable_version
  const collection = {
    ...extended_collection,
    editable_version: version.id,
  }
  return (
    <CollectionProvider collection={collection}>
      <VersionProvider version={version}>
        <Navbar collection={collectionSlug} />
        {children}
      </VersionProvider>
    </CollectionProvider>
  )
}
