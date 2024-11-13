import { getCollectionFromSlug } from '@/lib/supabase/db/collections'
import LayerTreeView from '@/components/elements/layers/tree'
import { getLayerTree } from '@/lib/supabase/db/layers'

export default async function LayerPage(props: {
  params: Promise<{ collection: string }>
}) {
  const params = await props.params
  const collection = await getCollectionFromSlug(params.collection)
  const tree = await getLayerTree(collection.id)
  return <LayerTreeView collection={collection} tree={tree} />
}
