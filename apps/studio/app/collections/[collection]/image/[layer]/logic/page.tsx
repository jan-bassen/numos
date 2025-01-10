import { getExtendedCollectionFromSlug } from '@/lib/supabase/db/collections'
import { getAllAttributes } from '@/lib/supabase/db/attributes/read'
import { getImageGraph } from '@/lib/supabase/db/image-graph'
import ImageNodeEditor from '@/app/collections/[collection]/image/(components)/image-editor'
import { getUploadsTree } from '@/lib/supabase/db/uploads'

export default async function Collection(props: {
  params: Promise<{ collection: string; layer: string }>
}) {
  const params = await props.params
  const collection = await getExtendedCollectionFromSlug(params.collection)

  const [attributes, graph, uploadsTree] = await Promise.all([
    getAllAttributes(collection.editable_version.id),
    getImageGraph(collection.editable_version.id),
    getUploadsTree(collection.editable_version.id),
  ])

  return (
    <ImageNodeEditor
      initialGraph={graph}
      version={collection.editable_version}
      layerTree={uploadsTree}
      attributes={attributes}
    />
  )
}
