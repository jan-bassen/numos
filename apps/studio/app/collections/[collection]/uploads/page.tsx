import { getCollectionFromSlug } from '@/lib/supabase/db/collections'
import UploadsTreeView from '@/app/collections/[collection]/uploads/(components)/tree'
import { getUploadsTree } from '@/lib/supabase/db/uploads'

export default async function LayerPage(props: {
  params: Promise<{ collection: string }>
}) {
  const params = await props.params
  const collection = await getCollectionFromSlug(params.collection)
  if (!collection.editable_version) return null
  const tree = await getUploadsTree(collection.editable_version)
  return <UploadsTreeView collection={collection} tree={tree} />
}
