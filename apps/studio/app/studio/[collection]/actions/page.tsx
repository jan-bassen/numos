import ActionGrid from '@/components/elements/actions/action-grid'
import { actionTypes } from '@/components/elements/actions/action-schema'
import { NewActionDialog } from '@/components/elements/actions/new-action-dialog'
import Header from '@/components/layout/pages/header'
import Main from '@/components/layout/pages/main'
import Page from '@/components/layout/pages/page'
import { iconClassesStroke } from '@/components/nav/navbar-links'
import SecondaryNavbar from '@/components/nav/secondary-navbar'
import { Button } from '@repo/ui/components/ui/button'
import { PiAddAddStroke, PiAutomationStroke } from '@repo/ui/icons/pika'
import { getAllActions } from '@/lib/supabase/db/actions'
import { getExtendedCollectionFromSlug } from '@/lib/supabase/db/collections'
import type { NavItem } from '@/types/database.types'

export default async function ActionsPage({
  params,
}: {
  params: { collection: string }
}) {
  const collection = await getExtendedCollectionFromSlug(params.collection)
  const actions = await getAllActions(collection.editable_version.id)
  const actionNavItems: NavItem[] = actions.map((action) => ({
    name: action.name,
    slug: action.slug,
    icon: action.trigger?.type ? (
      actionTypes[action.trigger.type].icon({ className: 'size-4' })
    ) : (
      <PiAutomationStroke className={iconClassesStroke} />
    ),
  }))

  return (
    <Page>
      <SecondaryNavbar
        versionId={collection.editable_version.id}
        collectionSlug={params.collection}
        type="actions"
        items={actionNavItems}
        title="Actions"
        NewItemDialog={NewActionDialog}
      />
      <Main>
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
        <ActionGrid
          collectionSlug={params.collection}
          actions={actions}
          versionId={collection.editable_version.id}
        />
      </Main>
    </Page>
  )
}
