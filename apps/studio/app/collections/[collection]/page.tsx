'use client'

import { CollectionDemo } from '@/app/collections/[collection]/(components)/collection-demo'
import { CollectionImage } from '@/app/collections/[collection]/(components)/collection-image'
import DeleteCollectionButton from '@/app/collections/[collection]/(components)/delete-collection-button'
import { CollectionExternalLinkInput } from '@/app/collections/[collection]/(components)/inputs/collection-external-link-input'
import { CollectionSlugInput } from '@/app/collections/[collection]/(components)/inputs/collection-slug-input'
import { CollectionTitle } from '@/app/collections/[collection]/(components)/inputs/collection-title'
import { VersionDescriptionInput } from '@/app/collections/[collection]/(components)/inputs/version-description-input'
import { LockCollectionButton } from '@/app/collections/[collection]/(components)/lock-collection-button'
import ActionContextMenu from '@/app/collections/[collection]/actions/(components)/action-context-menu'
import { NewActionDialog } from '@/app/collections/[collection]/actions/(components)/new-action/new-action-dialog'
import AttributeContextMenu from '@/app/collections/[collection]/attributes/(components)/attribute-context-menu'
import { NewAttributeDialog } from '@/app/collections/[collection]/attributes/(components)/new-attribute-dialog'
import LayerContextMenu from '@/app/collections/[collection]/image/(components)/layer-context-menu'
import { NewLayerDialog } from '@/app/collections/[collection]/image/(components)/new-layer/new-layer-dialog'
import {
  ElementCardButton,
  ElementCardLink,
} from '@/components/elements/element-card'
import Segment from '@/components/layouts/segmented/segment'
import SegmentedLayout from '@/components/layouts/segmented/segmented-layout'
import Section from '@/components/layouts/simple/section'
import SimpleGrid from '@/components/layouts/simple/simple-grid'
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
import { Page } from '@/components/page/page'
import { dataTypes } from '@/lib/constants/datatypes'
import { layerOptions } from '@/lib/constants/layers'
import { triggerOptions } from '@/lib/constants/triggers'
import { getActionGraph } from '@/lib/data/action-graph'
import { getAllActions } from '@/lib/data/actions'
import { getAllAttributes } from '@/lib/data/attributes/read'
import { getExtendedCollectionFromSlug } from '@/lib/data/collections'
import { getImageGraph } from '@/lib/data/image-graph'
import { getAllLayers } from '@/lib/data/layers/read'
import { useAsyncResource } from '@/lib/data/use-async-resource'
import {
  PiGridDashboard02Solid,
  PiReceipt01Solid,
  PiSettings02Solid,
} from '@repo/ui/icons/pika'
import { useParams } from 'next/navigation'
import type React from 'react'

function LabFlaskConical(props: React.JSX.IntrinsicElements['svg']) {
  return (
    <svg
      {...props}
      aria-hidden="true"
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        fillRule="evenodd"
        d="M8 3a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2v4.523a.5.5 0 0 0 .092.289l3.8 5.364 1.63 2.3c1.642 2.32-.016 5.524-2.856 5.524H6.335c-2.841 0-4.498-3.205-2.857-5.523l2.47-3.486 2.96-4.18A.5.5 0 0 0 9 8.524V4a1 1 0 0 1-1-1Zm3 1v4.523a2.5 2.5 0 0 1-.46 1.445l-1.364 1.925a6.3 6.3 0 0 1 1.28.044c1.185.163 2.165.642 2.985 1.08q.166.087.323.173h.002c1.043.56 1.807.971 2.655.958l-2.961-4.18A2.5 2.5 0 0 1 13 8.523V4zM9 15a1 1 0 0 0 0 2h.01a1 1 0 0 0 0-2z"
        clipRule="evenodd"
        fill="currentColor"
      />
    </svg>
  )
}

export default function Collection() {
  const params = useParams<{ collection: string }>()
  const { data: collection } = useAsyncResource(
    () => getExtendedCollectionFromSlug(params.collection),
    [params.collection],
  )
  const version = collection?.editable_version

  const { data: demoData } = useAsyncResource(async () => {
    if (!version) {
      return {
        attributes: [],
        actions: [],
        layers: [],
        actionGraphs: {},
        imageLayer: undefined,
        imageGraph: undefined,
      }
    }

    const [attributes, actions, layers] = await Promise.all([
      getAllAttributes(version.id),
      getAllActions(version.id),
      getAllLayers(version.id),
    ])
    const actionGraphEntries = await Promise.all(
      actions.map(async (action) => {
        const graph = await getActionGraph(action.id)
        return [action.id, graph] as const
      }),
    )
    const imageLayer =
      layers.find((layer) => layer.definition?.type === 'custom') ?? layers[0]
    const imageGraph = imageLayer
      ? await getImageGraph(imageLayer.id)
      : undefined

    return {
      attributes,
      actions,
      layers,
      actionGraphs: Object.fromEntries(actionGraphEntries),
      imageLayer,
      imageGraph,
    }
  }, [version?.id])
  const attributes = demoData?.attributes ?? []
  const actions = demoData?.actions ?? []
  const layers = demoData?.layers ?? []

  if (!collection || !version) return null

  return (
    <Page tabs tabsProps={{ defaultValue: 'demo', pageid: 'collection' }}>
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
          <HeaderTabBarItem value="demo" icon={LabFlaskConical}>
            Demo
          </HeaderTabBarItem>
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
      <Main value="demo">
        <CollectionDemo
          collection={collection}
          version={version}
          attributes={attributes}
          actions={actions}
          actionGraphs={demoData?.actionGraphs ?? {}}
          imageGraph={demoData?.imageGraph}
          imageLayer={demoData?.imageLayer}
        />
      </Main>
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
