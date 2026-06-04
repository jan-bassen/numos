'use client'

import { getExtendedCollectionFromSlug } from '@/lib/data/collections'
import { getAllAttributes } from '@/lib/data/attributes/read'
import { getImageGraph } from '@/lib/data/image-graph'
import ImageNodeEditor from '@/app/collections/[collection]/image/[layer]/logic/(components)/image-node-editor'
import { getUploadsTree } from '@/lib/data/uploads'
import { getLayerBySlugs } from '@/lib/data/layers/read'
import { notFound, useParams } from 'next/navigation'
import { useAsyncResource } from '@/lib/data/use-async-resource'

export default function LayerLogicPage() {
  const params = useParams<{ collection: string; layer: string }>()
  const { data: collection } = useAsyncResource(
    () => getExtendedCollectionFromSlug(params.collection),
    [params.collection],
  )
  const version = collection?.editable_version
  const { data: attributes } = useAsyncResource(
    () => (version ? getAllAttributes(version.id) : Promise.resolve([])),
    [version?.id],
  )
  const { data: uploadsTree } = useAsyncResource(
    () => (version ? getUploadsTree(version.id) : Promise.resolve(undefined)),
    [version?.id],
  )
  const { data: layer, loading: layerLoading } = useAsyncResource(
    () => getLayerBySlugs(params.collection, params.layer),
    [params.collection, params.layer],
  )
  const { data: graph } = useAsyncResource(
    () => (layer ? getImageGraph(layer.id) : Promise.resolve(undefined)),
    [layer?.id],
  )

  if (!layerLoading && !layer) {
    notFound()
  }

  if (!collection || !version || !layer || !graph || !uploadsTree) {
    return null
  }

  return (
    <ImageNodeEditor
      initialGraph={graph}
      version={version}
      uploads={uploadsTree}
      attributes={attributes ?? []}
      layer={layer}
      collectionSlug={params.collection}
    />
  )
}
