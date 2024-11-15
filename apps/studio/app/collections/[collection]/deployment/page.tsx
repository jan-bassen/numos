import Header from '@/components/page/header'
import Main from '@/components/page/main'
import Segment from '@/components/layouts/segmented/segment'
import SegmentedLayout from '@/components/layouts/segmented/segmented-layout'
import ComingSoonBadge from '@/components/misc/coming-soon-badge'
import { getExtendedCollectionFromSlug } from '@/lib/supabase/db/collections'

export default async function DeploymentPage(props: {
  params: Promise<{ collection: string }>
}) {
  const params = await props.params
  const collection = await getExtendedCollectionFromSlug(params.collection)

  return (
    <>
      <Header
        title="Deployment"
        subtitle="Configure the deployment settings for this collection"
      />
      <Main>
        <SegmentedLayout>
          <Segment title="Deployment" className="md:max-w-form-input">
            <ComingSoonBadge />
          </Segment>

          <Segment title="Deployment" className="md:max-w-form-input">
            <ComingSoonBadge />
          </Segment>
        </SegmentedLayout>
      </Main>
    </>
  )
}
