import { getExtendedCollectionFromSlug } from '@/lib/supabase/db/collections'
import { getAllUserImages } from '@/lib/supabase/storage/user-images'
import { getAllAttributes } from '@/lib/supabase/db/attributes'
import { getImageGraph } from '@/lib/supabase/db/image-graph'
import ImageNodeEditor from '@/components/elements/image/image-editor'
import { getLayerTree } from '@/lib/supabase/db/layers'

export default async function Collection(props: {
  params: Promise<{ collection: string }>
}) {
  const params = await props.params
  const collection = await getExtendedCollectionFromSlug(params.collection)

  const [attributes, graph, layerTree] = await Promise.all([
    getAllAttributes(collection.editable_version.id),
    getImageGraph(collection.editable_version.id),
    getLayerTree(collection.id),
  ])

  return (
    <ImageNodeEditor
      initialGraph={graph}
      version={collection.editable_version}
      layerTree={layerTree}
      attributes={attributes}
    />
  )
}
