import ActionNodeEditor from '@/app/collections/[collection]/actions/[action]/logic/(components)/action-node-editor'
import { getActionGraph } from '@/lib/supabase/db/action-graph'
import { getActionBySlug } from '@/lib/supabase/db/actions'
import { getAllAttributes } from '@/lib/supabase/db/attributes/read'
import { getExtendedCollectionFromSlug } from '@/lib/supabase/db/collections'

export default async function ActionPage(props: {
  params: Promise<{
    collection: string
    action: string
  }>
}) {
  const params = await props.params

  const { collection: collectionSlug, action: actionSlug } = params

  const collection = await getExtendedCollectionFromSlug(collectionSlug)
  const action = await getActionBySlug(
    actionSlug,
    collection.editable_version.id,
  )
  const graph = await getActionGraph(action.id)
  const attributes = await getAllAttributes(collection.editable_version.id)
  return (
    <ActionNodeEditor
      initialGraph={graph}
      version={collection.editable_version}
      action={action}
      attributes={attributes}
      collectionSlug={collectionSlug}
    />
  )
}
