import ActionGrid from '@/app/collections/[collection]/actions/(components)/action-grid'
import { NewActionDialog } from '@/app/collections/[collection]/actions/(components)/new-action-dialog'
import Header from '@/components/layout/pages/header'
import Main from '@/components/layout/pages/main'
import { Button } from '@repo/ui/components/ui/button'
import { PiAddAddStroke } from '@repo/ui/icons/pika'
import { getAllActions } from '@/lib/supabase/db/actions'
import { getExtendedCollectionFromSlug } from '@/lib/supabase/db/collections'

export default async function ActionsPage(props: {
  params: Promise<{ collection: string }>
}) {
  const params = await props.params
  const collection = await getExtendedCollectionFromSlug(params.collection)
  const actions = await getAllActions(collection.editable_version.id)

  return (
    <>
      <Header
        title="Actions"
        subtitle="Define the ways users (or yourself) can interact with the tokens."
      >
        <NewActionDialog
          button={
            <Button className="gap-1.5 pl-3">
              <PiAddAddStroke className="size-4" />
              New Action
            </Button>
          }
          versionId={collection.editable_version.id}
          collectionSlug={params.collection}
        />
      </Header>
      <Main>
        <ActionGrid
          collectionSlug={params.collection}
          actions={actions}
          versionId={collection.editable_version.id}
        />
      </Main>
    </>
  )
}
