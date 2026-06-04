'use client'

import { useParams } from 'next/navigation'
import { useAsyncResource } from '@/lib/data/use-async-resource'
import { NewActionDialog } from '@/app/collections/[collection]/actions/(components)/new-action/new-action-dialog'
import { NewAttributeDialog } from '@/app/collections/[collection]/attributes/(components)/new-attribute-dialog'
import Section from '@/components/layouts/simple/section'
import {
  Header,
  HeaderActions,
  HeaderContent,
  HeaderDescription,
  HeaderIcon,
  HeaderMain,
  HeaderTabBar,
  HeaderTabBarItem,
} from '@/components/page/header'
import Main from '@/components/page/main'
import { getLatestActions } from '@/lib/data/actions'
import { getLatestAttributes } from '@/lib/data/attributes/read'
import { getExtendedCollectionFromSlug } from '@/lib/data/collections'
import DeleteCollectionButton from '@/app/collections/[collection]/(components)/delete-collection-button'
import { Page } from '@/components/page/page'
import {
  PiGridDashboard02Solid,
  PiSettings02Solid,
  PiReceipt01Solid,
} from '@repo/ui/icons/pika'
import Segment from '@/components/layouts/segmented/segment'
import SegmentedLayout from '@/components/layouts/segmented/segmented-layout'
import { CollectionImage } from '@/app/collections/[collection]/(components)/collection-image'
import { LockCollectionButton } from '@/app/collections/[collection]/(components)/lock-collection-button'
import { CollectionTitle } from '@/app/collections/[collection]/(components)/inputs/collection-title'
import { CollectionSlugInput } from '@/app/collections/[collection]/(components)/inputs/collection-slug-input'
import { CollectionExternalLinkInput } from '@/app/collections/[collection]/(components)/inputs/collection-external-link-input'
import SimpleGrid from '@/components/layouts/simple/simple-grid'
import ActionContextMenu from '@/app/collections/[collection]/actions/(components)/action-context-menu'
import {
  ElementCardButton,
  ElementCardLink,
} from '@/components/elements/element-card'
import { triggerOptions } from '@/lib/constants/triggers'
import AttributeContextMenu from '@/app/collections/[collection]/attributes/(components)/attribute-context-menu'
import { dataTypes } from '@/lib/constants/datatypes'
import LayerContextMenu from '@/app/collections/[collection]/image/(components)/layer-context-menu'
import { getLatestLayers } from '@/lib/data/layers/read'
import { NewLayerDialog } from '@/app/collections/[collection]/image/(components)/new-layer/new-layer-dialog'
import { layerOptions } from '@/lib/constants/layers'
import { VersionDescriptionInput } from '@/app/collections/[collection]/(components)/inputs/version-description-input'

export default function Collection() {
  const params = useParams<{ collection: string }>()
  const { data: collection } = useAsyncResource(
    () => getExtendedCollectionFromSlug(params.collection),
    [params.collection],
  )
  const version = collection?.editable_version

  const { data: attributes } = useAsyncResource(
    () => (version ? getLatestAttributes(version.id, 5) : Promise.resolve([])),
    [version?.id],
  )
  const { data: actions } = useAsyncResource(
    () => (version ? getLatestActions(version.id, 5) : Promise.resolve([])),
    [version?.id],
  )
  const { data: layers } = useAsyncResource(
    () => (version ? getLatestLayers(version.id, 5) : Promise.resolve([])),
    [version?.id],
  )

  if (!collection || !version) return null

  return (
    <Page tabs tabsProps={{ defaultValue: 'overview', pageid: 'collection' }}>
      <Header>
        <HeaderContent>
          <HeaderMain>
            <HeaderIcon>
              <CollectionImage className="aspect-square size-full rounded-md object-cover" />
            </HeaderIcon>
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
          <SimpleGrid>
            {(attributes ?? []).map((attribute) => {
              return (
                <AttributeContextMenu
                  key={attribute.id}
                  attributeSlug={attribute.slug}
                  collectionSlug={collection.slug}
                  versionId={version.id}
                >
                  <ElementCardLink
                    href={`/collections/${collection.slug}/attributes/${attribute.slug}`}
                    label={attribute.name ?? 'New Attribute'}
                    subtitle={attribute.description}
                    icon={dataTypes[attribute.value.type].icons.stroke}
                  />
                </AttributeContextMenu>
              )
            })}
            <NewAttributeDialog versionId={version.id}>
              <ElementCardButton
                key="new-attribute"
                variant="new"
                label="New Attribute"
              />
            </NewAttributeDialog>
          </SimpleGrid>
        </Section>
        <Section
          title="Actions"
          link={`/collections/${collection.slug}/actions`}
          info={{
            description:
              'Actions change the state of one or more tokens. They are used to make your collection dynamic.',
          }}
        >
          <SimpleGrid>
            {(actions ?? []).map((action) => {
              return (
                <ActionContextMenu
                  key={action.slug}
                  actionSlug={action.slug}
                  collectionSlug={collection.slug}
                  versionId={version.id}
                >
                  <ElementCardLink
                    href={`/collections/${collection.slug}/actions/${action.slug}`}
                    label={action.name ?? 'Unnamed Action'}
                    subtitle={action.description}
                    icon={triggerOptions[action.trigger?.type || 'api'].Icon}
                  />
                </ActionContextMenu>
              )
            })}
            <NewActionDialog versionId={version.id}>
              <ElementCardButton variant="new" label="New Action" />
            </NewActionDialog>
          </SimpleGrid>
        </Section>
        <Section
          title="Layers"
          link={`/collections/${collection.slug}/image`}
          info={{
            description:
              'Layers are literally the layers of the tokens image. Use them to control the visual appearance of your collection.',
          }}
        >
          <SimpleGrid>
            {(layers ?? []).map((layer) => {
              return (
                <LayerContextMenu
                  key={layer.id}
                  layerSlug={layer.slug}
                  collectionSlug={collection.slug}
                  versionId={version.id}
                >
                  <ElementCardLink
                    href={`/collections/${collection.slug}/image/${layer.slug}`}
                    label={layer.name ?? 'New Layer'}
                    subtitle={layer.description}
                    icon={layerOptions[layer.definition?.type]?.Icon}
                  />
                </LayerContextMenu>
              )
            })}
            <NewLayerDialog versionId={version.id}>
              <ElementCardButton
                key="new-layer"
                variant="new"
                label="New Layer"
              />
            </NewLayerDialog>
          </SimpleGrid>
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
            <VersionDescriptionInput />
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
        </SegmentedLayout>
      </Main>
    </Page>
  )
}
