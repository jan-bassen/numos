import Page from '@/components/layout/pages/page'
import Navbar from '@/components/nav/navbar'
import MobileNavbar from '@/components/nav/navbar-mobile'
import { getAllCollections } from '@/lib/supabase/db/collections'
import { getProfile, getUser } from '@/lib/supabase/db/profile'
import { notFound } from 'next/navigation'

export default async function Layout(
  props: {
    children: React.ReactNode
    params: Promise<{ collection: string }>
  }
) {
  const params = await props.params;

  const {
    children
  } = props;

  const collections = await getAllCollections()
  const collection = collections.find((c) => c.slug === params.collection)
  if (!collection) {
    notFound()
  }
  const user = await getUser()
  const profile = await getProfile(user.id)
  return (
    <Page className="relative">
      <Navbar
        collections={collections}
        collection={collection}
        className="hidden md:flex"
        user={user}
        profile={profile}
      />
      <MobileNavbar
        user={user}
        profile={profile}
        collections={collections}
        collection={collection}
        blocking={true}
      />
      {children}
    </Page>
  )
}
