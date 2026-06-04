'use client'

import { useParams } from 'next/navigation'
import { useAsyncResource } from '@/lib/data/use-async-resource'
import {
  Header,
  HeaderActions,
  HeaderContent,
  HeaderMain,
  HeaderTabBar,
  HeaderTabBarItem,
  HeaderTitle,
} from '@/components/page/header'
import {
  PiAddAddStroke,
  PiLayerThreeSolid,
  PiSettings02Solid,
} from '@repo/ui/icons/pika'
import Main from '@/components/page/main'
import { Page } from '@/components/page/page'
import { ComingSoonBadge } from '@/components/misc/coming-soon-badge'
import { getAllLayers } from '@/lib/data/layers/read'
import { getExtendedCollectionFromSlug } from '@/lib/data/collections'
import { LayerView } from '@/app/collections/[collection]/image/(components)/layer-view/layer-view'
import { NewLayerDialog } from '@/app/collections/[collection]/image/(components)/new-layer/new-layer-dialog'
import { Button } from '@repo/ui/components/button'

export default function Collection() {
  const { collection: collectionSlug } = useParams<{ collection: string }>()
  const { data: collection } = useAsyncResource(
    () => getExtendedCollectionFromSlug(collectionSlug),
    [collectionSlug],
  )
  const version = collection?.editable_version
  const { data: layers } = useAsyncResource(
    () => (version ? getAllLayers(version.id) : Promise.resolve([])),
    [version?.id],
  )

  if (!collection || !version) return null

  return (
    <Page tabs tabsProps={{ pageid: 'image', defaultValue: 'layers' }}>
      <Header
        back={{
          href: `/collections/${collectionSlug}`,
          label: collection.name ?? 'Collection',
        }}
      >
        <HeaderContent>
          <HeaderMain>
            <HeaderTitle>Image Layers</HeaderTitle>
          </HeaderMain>
          <HeaderActions>
            <NewLayerDialog versionId={collection.editable_version.id}>
              <Button className="gap-1.5 pl-3">
                <PiAddAddStroke className="size-4" />
                New Layer
              </Button>
            </NewLayerDialog>
          </HeaderActions>
        </HeaderContent>
        <HeaderTabBar>
          <HeaderTabBarItem value="layers" icon={PiLayerThreeSolid}>
            Layers
          </HeaderTabBarItem>
          <HeaderTabBarItem value="tests" icon={PiSettings02Solid}>
            Settings
          </HeaderTabBarItem>
        </HeaderTabBar>
      </Header>
      <Main value="layers">
        <LayerView layers={layers ?? []} collectionSlug={collectionSlug} />
      </Main>
      <Main value="tests">
        <ComingSoonBadge />
      </Main>
    </Page>
  )
}
