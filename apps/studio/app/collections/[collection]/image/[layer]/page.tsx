import {
  Header,
  HeaderActions,
  HeaderContent,
  HeaderMain,
  HeaderTitle,
} from '@/components/page/header'
import Main from '@/components/page/main'
import { Page } from '@/components/page/page'
import { ComingSoonBadge } from '@/components/misc/coming-soon-badge'

export default async function Collection(props: {
  params: Promise<{ collection: string; layer: string }>
}) {
  return (
    <Page>
      <Header>
        <HeaderContent>
          <HeaderMain>
            <HeaderTitle>Layer</HeaderTitle>
          </HeaderMain>
          <HeaderActions />
        </HeaderContent>
      </Header>
      <Main>
        <ComingSoonBadge />
      </Main>
    </Page>
  )
}
