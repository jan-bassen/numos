import {
  Header,
  HeaderContent,
  HeaderMain,
  HeaderTitle,
} from '@/components/page/header'
import Main from '@/components/page/main'
import Segment from '@/components/layouts/segmented/segment'
import SegmentedLayout from '@/components/layouts/segmented/segmented-layout'
import { getExtendedCollectionFromSlug } from '@/lib/supabase/db/collections'
import { Page } from '@/components/page/page'

export default async function MintSettingsPage(props: {
  params: Promise<{ collection: string }>
}) {
  const params = await props.params
  const collection = await getExtendedCollectionFromSlug(params.collection)

  return (
    <Page>
      <Header>
        <HeaderContent>
          <HeaderMain>
            <HeaderTitle>Mint</HeaderTitle>
          </HeaderMain>
        </HeaderContent>
      </Header>
      <Main>
        <SegmentedLayout>
          <Segment title="Allowlist">Coming soon!</Segment>
        </SegmentedLayout>
      </Main>
    </Page>
  )
}
