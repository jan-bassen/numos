import { Navbar } from '@/components/navigation/navbar/navbar'
import { getExtendedCollectionFromSlug } from '@/lib/supabase/db/collections'
import { CollectionProvider } from './collection-context'

export default async function Layout({
  params,
  children,
}: {
  children: React.ReactNode
  params: Promise<{ collection: string }>
}) {
  const { collection: collectionSlug } = await params
  const collection = await getExtendedCollectionFromSlug(collectionSlug)
  return (
    <CollectionProvider collection={collection}>
      <Navbar collection={collectionSlug} />
      {children}
    </CollectionProvider>
  )
}
