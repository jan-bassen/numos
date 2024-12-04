import ActionGrid from '@/app/collections/[collection]/actions/(components)/action-grid'
import { NewActionDialog } from '@/app/collections/[collection]/actions/(components)/new-action-dialog'
import {
  Header,
  HeaderActions,
  HeaderContent,
  HeaderMain,
  HeaderTitle,
} from '@/components/page/header'
import Main from '@/components/page/main'
import { Button } from '@repo/ui/components/ui/button'
import { PiAddAddStroke } from '@repo/ui/icons/pika'
import { getAllActions } from '@/lib/supabase/db/actions'
import { getExtendedCollectionFromSlug } from '@/lib/supabase/db/collections'
import { Page } from '@/components/page/page'

export default async function ActionsPage(props: {
  params: Promise<{ collection: string }>
}) {
  const params = await props.params
  const collection = await getExtendedCollectionFromSlug(params.collection)
  const actions = await getAllActions(collection.editable_version.id)

  return (
    <Page>
      <Header>
        <HeaderContent>
          <HeaderMain>
            <HeaderTitle>Actions</HeaderTitle>
          </HeaderMain>
          <HeaderActions>
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
          </HeaderActions>
        </HeaderContent>
      </Header>
      <Main>
        <ActionGrid
          collectionSlug={params.collection}
          actions={actions}
          versionId={collection.editable_version.id}
        />
      </Main>
    </Page>
  )
}
