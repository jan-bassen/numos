import {
  Header,
  HeaderActions,
  HeaderContent,
  HeaderMain,
  HeaderTabBar,
  HeaderTabBarItem,
  HeaderTitle,
} from '@/components/page/header'
import { PiLayerThreeSolid, PiSettings02Solid } from '@repo/ui/icons/pika'
import Main from '@/components/page/main'
import { Page } from '@/components/page/page'
import { ComingSoonBadge } from '@/components/misc/coming-soon-badge'

export default async function Collection(props: {
  params: Promise<{ collection: string }>
}) {
  return (
    <Page tabs tabsProps={{ pageid: 'image', defaultValue: 'layers' }}>
      <Header>
        <HeaderContent>
          <HeaderMain>
            <HeaderTitle>Image</HeaderTitle>
          </HeaderMain>
          <HeaderActions />
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
      <Main value="layers">Hi</Main>
      <Main value="tests">
        <ComingSoonBadge />
      </Main>
    </Page>
  )
}
