import Header from '@/components/page/header'
import Main from '@/components/page/main'
import ComingSoonBadge from '@/components/misc/coming-soon-badge'
import { getExtendedCollectionFromSlug } from '@/lib/supabase/db/collections'

export default async function ImageSettingsPage(props: {
  params: Promise<{ collection: string }>
}) {
  const params = await props.params
  const collection = await getExtendedCollectionFromSlug(params.collection)

  return (
    <>
      <Header
        title="Image Settings"
        subtitle="Configure the settings for the images in this collection"
      />
      <Main className="md:px-18 md:pt-12">
        <ComingSoonBadge />
      </Main>
    </>
  )
}
