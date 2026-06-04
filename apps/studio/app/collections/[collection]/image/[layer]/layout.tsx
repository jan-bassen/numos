'use client'

import { notFound, useParams } from 'next/navigation'
import { getLayerBySlugs } from '@/lib/data/layers/read'
import { useAsyncResource } from '@/lib/data/use-async-resource'
import { LayerProvider } from './context'

export default function ImageLayerLayout(props: {
  children: React.ReactNode
}) {
  const { collection, layer: layerSlug } = useParams<{
    collection: string
    layer: string
  }>()

  const { data: layer, loading } = useAsyncResource(
    () => getLayerBySlugs(collection, layerSlug),
    [collection, layerSlug],
  )
  if (loading) return null
  if (!layer) {
    notFound()
  }

  return <LayerProvider layer={layer}>{props.children}</LayerProvider>
}
