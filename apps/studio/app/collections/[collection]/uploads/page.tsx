'use client'

import { useEffect } from 'react'
import { useParams } from 'next/navigation'
import { getCollectionFromSlug } from '@/lib/data/collections'
import UploadsTreeView from '@/app/collections/[collection]/uploads/(components)/tree'
import { getUploadsTree } from '@/lib/data/uploads'
import { useAsyncResource } from '@/lib/data/use-async-resource'
import { UPLOADS_CHANGED_EVENT } from '@/app/collections/[collection]/uploads/(functions)/upload'

export default function LayerPage() {
  const { collection: collectionSlug } = useParams<{ collection: string }>()
  const { data: collection } = useAsyncResource(
    () => getCollectionFromSlug(collectionSlug),
    [collectionSlug],
  )
  const version = collection?.editable_version
  const { data: tree, reload } = useAsyncResource(
    () => (version ? getUploadsTree(version) : Promise.resolve(undefined)),
    [version],
  )

  useEffect(() => {
    window.addEventListener(UPLOADS_CHANGED_EVENT, reload)
    return () => window.removeEventListener(UPLOADS_CHANGED_EVENT, reload)
  }, [reload])

  if (!collection || !version || !tree) return null

  return <UploadsTreeView collection={collection} tree={tree} />
}
