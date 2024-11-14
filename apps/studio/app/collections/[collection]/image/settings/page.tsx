import Header from '@/components/layout/pages/header'
import Main from '@/components/layout/pages/main'
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
      <Main>Hi</Main>
    </>
  )
}
