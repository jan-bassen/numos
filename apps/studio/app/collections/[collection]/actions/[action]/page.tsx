import ActionEditor from '@/components/elements/actions/action-editor'
import Main from '@/components/layout/pages/main'
import { getActionBySlug } from '@/lib/supabase/db/actions'
import { getExtendedCollectionFromSlug } from '@/lib/supabase/db/collections'

export default async function ActionPage(
  props: {
    params: Promise<{
      collection: string
      action: string
    }>
  }
) {
  const params = await props.params;

  const {
    collection,
    action
  } = params;

  const fullCollection = await getExtendedCollectionFromSlug(collection)
  const fullAction = await getActionBySlug(
    action,
    fullCollection.editable_version.id,
  )

  console.log('action fetched')
  return (
    <Main>
      <ActionEditor
        action={fullAction}
        collectionSlug={collection}
        version={fullCollection.editable_version}
      />
    </Main>
  )
}
