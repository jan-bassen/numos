import { iconClassesStroke } from '@/components/nav/navbar-links'
import SecondaryNavbar from '@/components/nav/secondary-navbar'
import { PiAutomationStroke } from '@repo/ui/icons/pika'
import { getActionsForNav } from '@/lib/supabase/db/actions'
import { getCollectionFromSlug } from '@/lib/supabase/db/collections'
import type { NavItem } from '@/types/database.types'
import Page from '@/components/layout/pages/page'
import { actionTypes } from '@/components/elements/actions/action-schema'
import { NewActionDialog } from '@/components/elements/actions/new-action-dialog'

export default async function ActionsLayout(
  props: {
    children: React.ReactNode
    params: Promise<{
      collection: string
      action: string
    }>
  }
) {
  const params = await props.params;

  const {
    children
  } = props;

  const collection = await getCollectionFromSlug(params.collection)
  if (!collection.editable_version) throw new Error('No editable version')
  const actions: NavItem[] = (await getActionsForNav(params.collection)).map(
    (action) => ({
      name: action.name,
      slug: action.slug,
      icon: action.type ? (
        actionTypes[action.type].icon({ className: 'size-4' })
      ) : (
        <PiAutomationStroke className={iconClassesStroke} />
      ),
    }),
  )
  return (
    <Page>
      <SecondaryNavbar
        versionId={collection.editable_version}
        collectionSlug={params.collection}
        current={params.action}
        type="actions"
        items={actions}
        title="Actions"
        NewItemDialog={NewActionDialog}
      />
      {children}
    </Page>
  )
}
