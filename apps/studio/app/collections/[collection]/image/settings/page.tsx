import {
  Header,
  HeaderContent,
  HeaderMain,
  HeaderTitle,
} from '@/components/page/header'
import Main from '@/components/page/main'
import ComingSoonBadge from '@/components/misc/coming-soon-badge'
import { getExtendedCollectionFromSlug } from '@/lib/supabase/db/collections'
import { Page } from '@/components/page/page'

export default async function ImageSettingsPage(props: {
  params: Promise<{ collection: string }>
}) {
  const params = await props.params
  const collection = await getExtendedCollectionFromSlug(params.collection)

  return (
    <Page>
      <Header>
        <HeaderContent>
          <HeaderMain>
            <HeaderTitle>Image Settings</HeaderTitle>
          </HeaderMain>
        </HeaderContent>
      </Header>
      <Main className="md:px-18 md:pt-12">
        <ComingSoonBadge />
      </Main>
    </Page>
  )
}
