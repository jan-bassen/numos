import {
  Header,
  HeaderActions,
  HeaderContent,
  HeaderMain,
  HeaderTabBar,
  HeaderTabBarItem,
} from '@/components/page/header'
import Main from '@/components/page/main'
import { Page } from '@/components/page/page'
import { DeleteLayerButton } from '@/app/collections/[collection]/image/[layer]/(components)/delete-layer-button'
import { LockLayerButton } from '@/app/collections/[collection]/image/[layer]/(components)/lock-layer-button'
import Segment from '@/components/layouts/segmented/segment'
import { layerOptionsArray } from '@/lib/constants/layers'
import SegmentedLayout from '@/components/layouts/segmented/segmented-layout'
import { LayerDefinitionsSegment } from '@/app/collections/[collection]/image/[layer]/(components)/definitions/definitions-segment'
import {
  PiPhotoImageDefaultSolid,
  PiSettings02Solid,
} from '@repo/ui/icons/pika'
import { LayerDescriptionInput } from '@/app/collections/[collection]/image/[layer]/(components)/inputs/layer-description-input'
import { LayerSlugInput } from '@/app/collections/[collection]/image/[layer]/(components)/inputs/layer-slug-input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/components/select'
import { ComingSoonBadge } from '@/components/misc/coming-soon-badge'
import { LayerTitle } from '@/app/collections/[collection]/image/[layer]/(components)/layer-title'

export default async function ImageLayerPage(props: {
  params: Promise<{ collection: string; layer: string }>
}) {
  const { collection } = await props.params
  return (
    <Page tabs tabsProps={{ defaultValue: 'image', pageid: 'layer' }}>
      <Header
        back={{
          href: `/collections/${collection}/image`,
          label: 'All Layers',
        }}
      >
        <HeaderContent>
          <HeaderMain>
            <LayerTitle />
          </HeaderMain>
          <HeaderActions>
            <DeleteLayerButton />
            <LockLayerButton />
          </HeaderActions>
        </HeaderContent>
        <HeaderTabBar>
          <HeaderTabBarItem value="image" icon={PiPhotoImageDefaultSolid}>
            Image
          </HeaderTabBarItem>
          <HeaderTabBarItem value="settings" icon={PiSettings02Solid}>
            Settings
          </HeaderTabBarItem>
        </HeaderTabBar>
      </Header>
      <Main value="image">
        <SegmentedLayout>
          <Segment
            title="Layer Type"
            info={{
              description: 'Select what type of layer this is.',
              options: layerOptionsArray.map((o) => ({
                label: o.label,
                explanation: o.description || '',
              })),
            }}
          >
            <Select value="custom">
              <SelectTrigger disabled>
                <SelectValue>Custom Logic</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="custom">Custom Logic</SelectItem>
              </SelectContent>
            </Select>
            <ComingSoonBadge
              title="More types coming soon!"
              description="We are working hard to bring you more types of layers. Stay tuned for updates!"
            />
          </Segment>
          <LayerDefinitionsSegment />
        </SegmentedLayout>
      </Main>
      <Main value="settings">
        <SegmentedLayout>
          <Segment title="Identifier">
            <LayerSlugInput />
          </Segment>
          <Segment title="Description">
            <LayerDescriptionInput />
          </Segment>
        </SegmentedLayout>
      </Main>
    </Page>
  )
}
