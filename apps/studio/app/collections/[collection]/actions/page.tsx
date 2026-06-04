'use client'

import { useParams } from 'next/navigation'
import { useAsyncResource } from '@/lib/data/use-async-resource'
import { NewActionDialog } from '@/app/collections/[collection]/actions/(components)/new-action/new-action-dialog'
import {
  Header,
  HeaderActions,
  HeaderContent,
  HeaderMain,
  HeaderTitle,
} from '@/components/page/header'
import Main from '@/components/page/main'
import { Button } from '@repo/ui/components/button'
import { PiAddAddStroke } from '@repo/ui/icons/pika'
import { getAllActions } from '@/lib/data/actions'
import { getExtendedCollectionFromSlug } from '@/lib/data/collections'
import { Page } from '@/components/page/page'
import SimpleGrid from '@/components/layouts/simple/simple-grid'
import ActionContextMenu from '@/app/collections/[collection]/actions/(components)/action-context-menu'
import {
  ElementCardButton,
  ElementCardLink,
} from '@/components/elements/element-card'
import { triggerOptions } from '@/lib/constants/triggers'

export default function ActionsPage() {
  const params = useParams<{ collection: string }>()
  const { data: collection } = useAsyncResource(
    () => getExtendedCollectionFromSlug(params.collection),
    [params.collection],
  )
  const version = collection?.editable_version
  const { data: actions } = useAsyncResource(
    () => (version ? getAllActions(version.id) : Promise.resolve([])),
    [version?.id],
  )

  if (!collection || !version) return null

  return (
    <Page>
      <Header
        back={{
          href: `/collections/${params.collection}`,
          label: collection.name ?? 'Collection',
        }}
      >
        <HeaderContent>
          <HeaderMain>
            <HeaderTitle>Actions</HeaderTitle>
          </HeaderMain>
          <HeaderActions>
            <NewActionDialog versionId={collection.editable_version.id}>
              <Button className="gap-1.5 pl-3">
                <PiAddAddStroke className="size-4" />
                New Action
              </Button>
            </NewActionDialog>
          </HeaderActions>
        </HeaderContent>
      </Header>
      <Main>
        <SimpleGrid>
          {(actions ?? []).map((action) => {
            return (
              <ActionContextMenu
                key={action.slug}
                actionSlug={action.slug}
                collectionSlug={params.collection}
                versionId={collection.editable_version.id}
              >
                <ElementCardLink
                  href={`/collections/${params.collection}/actions/${action.slug}`}
                  label={action.name ?? 'Unnamed Action'}
                  subtitle={action.description}
                  icon={triggerOptions[action.trigger?.type || 'api'].Icon}
                />
              </ActionContextMenu>
            )
          })}
          <NewActionDialog versionId={collection.editable_version.id}>
            <ElementCardButton size="md" variant="new" label="New Action" />
          </NewActionDialog>
        </SimpleGrid>
      </Main>
    </Page>
  )
}
