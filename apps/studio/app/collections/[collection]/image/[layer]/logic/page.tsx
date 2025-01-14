import { getExtendedCollectionFromSlug } from '@/lib/supabase/db/collections'
import { getAllAttributes } from '@/lib/supabase/db/attributes/read'
import { getImageGraph } from '@/lib/supabase/db/image-graph'
import ImageNodeEditor from '@/app/collections/[collection]/image/[layer]/logic/(components)/image-node-editor'
import { getUploadsTree } from '@/lib/supabase/db/uploads'
import { z } from 'zod'
import { getLayerBySlugs } from '@/lib/supabase/db/layers/read'
import { notFound } from 'next/navigation'

export default async function LayerLogicPage(props: {
  params: Promise<{ collection: string; layer: string }>
}) {
  const params = await props.params
  const collection = await getExtendedCollectionFromSlug(params.collection)

  const [attributes, layer] = await Promise.all([
    getAllAttributes(collection.editable_version.id),
    getLayerBySlugs(params.collection, params.layer),
  ])

  if (!layer) {
    notFound()
  }

  const [uploadsTree, graph] = await Promise.all([
    getUploadsTree(layer.id),
    getImageGraph(layer.id),
  ])

  return (
    <ImageNodeEditor
      initialGraph={graph}
      version={collection.editable_version}
      layerTree={uploadsTree}
      attributes={attributes}
      layer={layer}
      collectionSlug={params.collection}
    />
  )
}
