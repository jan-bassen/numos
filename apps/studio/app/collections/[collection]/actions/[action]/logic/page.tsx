'use client'

import { useParams } from 'next/navigation'
import { useAsyncResource } from '@/lib/data/use-async-resource'
import ActionNodeEditor from '@/app/collections/[collection]/actions/[action]/logic/(components)/action-node-editor'
import { getActionGraph } from '@/lib/data/action-graph'
import { getActionBySlug } from '@/lib/data/actions'
import { getAllAttributes } from '@/lib/data/attributes/read'
import { getExtendedCollectionFromSlug } from '@/lib/data/collections'

export default function ActionPage() {
  const { collection: collectionSlug, action: actionSlug } = useParams<{
    collection: string
    action: string
  }>()

  const { data: collection } = useAsyncResource(
    () => getExtendedCollectionFromSlug(collectionSlug),
    [collectionSlug],
  )
  const version = collection?.editable_version
  const { data: action } = useAsyncResource(
    () =>
      version
        ? getActionBySlug(actionSlug, version.id)
        : Promise.resolve(undefined),
    [actionSlug, version?.id],
  )
  const { data: graph } = useAsyncResource(
    () => (action ? getActionGraph(action.id) : Promise.resolve(undefined)),
    [action?.id],
  )
  const { data: attributes } = useAsyncResource(
    () => (version ? getAllAttributes(version.id) : Promise.resolve([])),
    [version?.id],
  )

  if (!collection || !version || !action || !graph) return null

  return (
    <ActionNodeEditor
      initialGraph={graph}
      version={version}
      action={action}
      attributes={attributes ?? []}
      collectionSlug={collectionSlug}
    />
  )
}
