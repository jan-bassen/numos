import { getCollectionFromSlug } from '@/lib/supabase/db/collections'
import LayerTreeView from '@/app/collections/[collection]/uploads/(components)/tree'
import { getLayerTree } from '@/lib/supabase/db/layers'

export default async function LayerPage(props: {
  params: Promise<{ collection: string }>
}) {
  const params = await props.params
  const collection = await getCollectionFromSlug(params.collection)
  if (!collection.editable_version) return null
  const tree = await getLayerTree(collection.editable_version)
  return <LayerTreeView collection={collection} tree={tree} />
}
