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

  const { collection, action } = params

  const fullCollection = await getExtendedCollectionFromSlug(collection)
  const fullAction = await getActionBySlug(
    action,
    fullCollection.editable_version.id,
  )
  const graph = await getActionGraph(fullAction.id)
  const attributes = await getAllAttributes(fullCollection.editable_version.id)
  return (
    <ActionNodeEditor
      initialGraph={graph}
      version={fullCollection.editable_version}
      action={fullAction}
      attributes={attributes}
      collectionSlug={collection}
    />
  )
}
