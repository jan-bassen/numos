import ActionCard from '@/components/elements/actions/action-card'
import { NewActionDialog } from '@/components/elements/actions/new-action-dialog'
import AttributeCard from '@/components/elements/attributes/attribute-card'
import { NewAttributeDialog } from '@/components/elements/attributes/new-attribute-dialog'
import CardRow from '@/components/layout/elements/card-row'
import Segment from '@/components/layout/elements/segment'
import Header from '@/components/layout/pages/header'
import Main from '@/components/layout/pages/main'
import type { BadgeVariant } from '@repo/ui/components/ui/badge'
import { buttonVariants } from '@repo/ui/components/ui/button'
import { PiSettings02Stroke } from '@repo/ui/icons/pika'
import { getLatestActions } from '@/lib/supabase/db/actions'
import { getLatestAttributes } from '@/lib/supabase/db/attributes'
import { getExtendedCollectionFromSlug } from '@/lib/supabase/db/collections'
import { SupabaseImage } from '@/lib/supabase/storage/supabaseImage'
import { cn } from '@repo/ui/lib/utils'
import Link from 'next/link'

export default async function Collection({
  params,
}: {
  params: { collection: string }
}) {
  const collection = await getExtendedCollectionFromSlug(params.collection)
  const version = collection.editable_version
  const badge = {
    text: `${version.major}.${version.minor}.${version.patch}`,
    variant: 'secondary' as BadgeVariant,
  }
  const attributes = await getLatestAttributes(version.id, 3)
  const actions = await getLatestActions(version.id, 3)
  return (
    <Main>
      <Header
        title={collection.name || 'Unnamed Collection'}
        subtitle={collection.description || ''}
        /* badge={badge} */
        icon={
          collection?.image ? (
            <SupabaseImage
              height={48}
              width={48}
              className="aspect-square rounded-md object-cover"
              alt="Collection Image"
              src={`collection-images/${collection.image}`}
            />
          ) : null
        }
      >
        <Link
          href={`/studio/${collection.slug}/settings`}
          className={cn('gap-2', buttonVariants())}
        >
          <PiSettings02Stroke className="size-4" />
          Settings
        </Link>
      </Header>
      {/* <QuickLinks
        links={[
          {
            Icon: PiPhotoImageDefaultStroke,
            label: "Edit Image",
            href: `/studio/${collection.slug}/image`,
          },
          {
            Icon: PiLayerThreeStroke,
            label: "Manage Layers",
            href: `/studio/${collection.slug}/layers`,
          },
          {
            Icon: PiSettings02Stroke,
            label: "Change Settings",
            href: `/studio/${collection.slug}/settings`,
          },
        ]}
      /> */}
      {/* <div className="grid grid-cols-1 gap-8 md:grid-cols-2"> */}
      <Segment
        title="Attributes"
        link={`/studio/${collection.slug}/attributes`}
      >
        <CardRow
          className="lg:grid-cols-2"
          cards={attributes.map((attribute) => {
            return {
              component: (
                <AttributeCard
                  key={attribute.id}
                  attribute={attribute}
                  collectionSlug={collection.slug}
                />
              ),
              key: attribute.id,
            }
          })}
          createButton={
            <NewAttributeDialog
              versionId={version.id}
              collectionSlug={collection.slug}
              button={
                <AttributeCard
                  key="new-attribute"
                  collectionSlug={collection.slug}
                />
              }
            />
          }
        />
      </Segment>
      <Segment title="Actions" link={`/studio/${collection.slug}/actions`}>
        <CardRow
          className="lg:grid-cols-2"
          cards={actions.map((action) => {
            return {
              component: (
                <ActionCard
                  key={action.id}
                  action={action}
                  collectionSlug={collection.slug}
                />
              ),
              key: action.id,
            }
          })}
          createButton={
            <NewActionDialog
              versionId={version.id}
              collectionSlug={collection.slug}
              button={
                <ActionCard key="new-action" collectionSlug={collection.slug} />
              }
            />
          }
        />
      </Segment>
    </Main>
  )
}
