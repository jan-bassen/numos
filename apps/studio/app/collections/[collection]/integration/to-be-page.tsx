import Header from '@/components/page/header'
import Main from '@/components/page/main'
import Segment from '@/components/layouts/segmented/segment'
import SegmentedLayout from '@/components/layouts/segmented/segmented-layout'
import { getExtendedCollectionFromSlug } from '@/lib/supabase/db/collections'
import ApiKeys from './(components)/api-keys'

export default async function DeploymentPage(props: {
  params: Promise<{ collection: string }>
}) {
  const params = await props.params
  const collection = await getExtendedCollectionFromSlug(params.collection)

  return (
    <>
      <Header
        title="Integration"
        subtitle="Configure the interfaces to your collection"
      />
      <Main>
        <SegmentedLayout>
          <Segment title="API-Keys">
            <ApiKeys />
          </Segment>
          <Segment title="Smart Contract">Coming soon!</Segment>
        </SegmentedLayout>
      </Main>
    </>
  )
}
