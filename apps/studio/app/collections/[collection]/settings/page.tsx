import CollectionEditor from './(components)/collection-editor'
import { getExtendedCollectionFromSlug } from '@/lib/supabase/db/collections'

export default async function CollectionSettingsPage({
  params,
}: {
  params: Promise<{ collection: string }>
}) {
  const { collection: collectionSlug } = await params
  const collection = await getExtendedCollectionFromSlug(collectionSlug)
  return <CollectionEditor collection={collection} />
}
