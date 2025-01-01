import ActionCard from '@/app/collections/[collection]/actions/(components)/action-card'
import { NewActionDialog } from '@/app/collections/[collection]/actions/(components)/new-action-dialog'
import AttributeCard from '@/app/collections/[collection]/attributes/(components)/attribute-card'
import { NewAttributeDialog } from '@/app/collections/[collection]/attributes/(components)/new-attribute-dialog'
import CardRow from '@/components/layouts/simple/card-row'
import Section from '@/components/layouts/simple/section'
import {
  Header,
  HeaderActions,
  HeaderContent,
  HeaderIcon,
  HeaderMain,
  HeaderTabBar,
  HeaderTabBarItem,
} from '@/components/page/header'
import Main from '@/components/page/main'
import { getLatestActions } from '@/lib/supabase/db/actions'
import { getLatestAttributes } from '@/lib/supabase/db/attributes/read'
import { getExtendedCollectionFromSlug } from '@/lib/supabase/db/collections'
import DeleteCollectionButton from '@/app/collections/[collection]/(components)/delete-collection-button'
import { Page } from '@/components/page/page'
import {
  PiGridDashboard02Solid,
  PiSettings02Solid,
  PiReceipt01Solid,
} from '@repo/ui/icons/pika'
import Segment from '@/components/layouts/segmented/segment'
import SegmentedLayout from '@/components/layouts/segmented/segmented-layout'
import ApiKeys from '@/app/collections/[collection]/(components)/api-keys'
import { CollectionImage } from '@/app/collections/[collection]/(components)/collection-image'
import { LockCollectionButton } from '@/app/collections/[collection]/(components)/lock-collection-button'
import { CollectionTitle } from '@/app/collections/[collection]/(components)/collection-title'
import { CollectionSlugInput } from '@/app/collections/[collection]/(components)/collection-slug-input'
import { CollectionExternalLinkInput } from '@/app/collections/[collection]/(components)/collection-external-link-input'
import { CollectionDescriptionInput } from '@/app/collections/[collection]/(components)/collection-description-input'
import { CollectionSymbolInput } from '@/app/collections/[collection]/(components)/collection-symbol-input'
export default async function Collection(props: {
  params: Promise<{ collection: string }>
}) {
  const params = await props.params
  const collection = await getExtendedCollectionFromSlug(params.collection)
  const version = collection.editable_version
  const attributes = await getLatestAttributes(version.id, 5)
  const actions = await getLatestActions(version.id, 5)
  return (
    <Page tabs tabsProps={{ defaultValue: 'overview', pageid: 'collection' }}>
      <Header>
        <HeaderContent>
          <HeaderMain>
            {collection?.image && (
              <HeaderIcon>
                <CollectionImage className="aspect-square size-full rounded-md object-cover" />
              </HeaderIcon>
            )}
            <CollectionTitle />
          </HeaderMain>
          <HeaderActions>
            <LockCollectionButton />
            <DeleteCollectionButton />
          </HeaderActions>
        </HeaderContent>
        <HeaderTabBar>
          <HeaderTabBarItem value="overview" icon={PiGridDashboard02Solid}>
            Overview
          </HeaderTabBarItem>
          <HeaderTabBarItem value="metadata" icon={PiReceipt01Solid}>
            Metadata
          </HeaderTabBarItem>
          <HeaderTabBarItem value="settings" icon={PiSettings02Solid}>
            Settings
          </HeaderTabBarItem>
        </HeaderTabBar>
      </Header>
      <Main value="overview">
        <Section
          title="Attributes"
          link={`/collections/${collection.slug}/attributes`}
          info={{
            description:
              'Attributes are basically the traits of all of your tokens. They are used to define the properties of the collection.',
          }}
        >
          <CardRow
            className="md:grid-cols-3 lg:grid-cols-2"
            cards={attributes.map((attribute) => {
              return {
                component: (
                  <AttributeCard
                    key={attribute.id}
                    attribute={attribute}
                    collectionSlug={collection.slug}
                    size="sm"
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
                    size="sm"
                  />
                }
              />
            }
          />
        </Section>
        <Section
          title="Actions"
          link={`/collections/${collection.slug}/actions`}
          info={{
            description:
              'Actions change the state of one or more tokens. They are used to make your collection dynamic.',
          }}
        >
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
                  <ActionCard
                    key="new-action"
                    collectionSlug={collection.slug}
                  />
                }
              />
            }
          />
        </Section>
      </Main>
      <Main value="settings">
        <SegmentedLayout>
          <Segment
            title="Identifier"
            info={{
              description:
                'Define a unique identifier for the collection. This will be used to reference the collection in the API.',
            }}
          >
            <CollectionSlugInput />
          </Segment>
          {/* <Segment
            title="Max Supply"
            description="Define the maximum supply for the collection. This will limit the number of tokens that can be minted."
          >
            <CollectionMaxSupplyInput />
          </Segment> */}

          <Segment
            title="API-Keys"
            info={{
              description:
                'Manage the API-Keys for the collection. These keys can be used to access the collection via the API.',
            }}
          >
            <ApiKeys />
          </Segment>
        </SegmentedLayout>
      </Main>
      <Main value="metadata">
        <SegmentedLayout>
          <Segment
            title="Description"
            info={{
              description:
                'Describe the collection in a few sentences. This will show up publicly e.g. on marketplaces.',
            }}
          >
            <CollectionDescriptionInput />
          </Segment>
          <Segment
            title="External Link"
            info={{
              description:
                'Link to the collection on an external website. This will show up publicly e.g. on marketplaces.',
            }}
          >
            <CollectionExternalLinkInput />
          </Segment>
          <Segment
            title="Symbol"
            info={{
              description:
                'The symbol of the collection. This will show up publicly e.g. on marketplaces.',
            }}
          >
            <CollectionSymbolInput />
          </Segment>
        </SegmentedLayout>
      </Main>
    </Page>
  )
}
