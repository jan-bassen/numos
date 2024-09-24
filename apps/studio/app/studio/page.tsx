import { getAllExtendedCollections } from '@/lib/supabase/db/collections'
import Main from '@/components/layout/pages/main'
import Page from '@/components/layout/pages/page'
import CollectionCard from '../../components/elements/collections/collection-card'
import Segment from '@/components/layout/elements/segment'
import CardRow from '@/components/layout/elements/card-row'
import type { ExtendedCollection } from '@/types/database.types'
import { getProfile, getUser } from '@/lib/supabase/db/profile'
import Navbar from '@/components/nav/navbar'
import MobileNavbar from '@/components/nav/navbar-mobile'
import Header from '@/components/layout/pages/header'
import EmptyCollectionsView from '@/components/elements/collections/empty-collection-view'
import { NewCollectionDialog } from '@/components/elements/collections/new-collection-dialog'

export default async function HomePage() {
  const collections: ExtendedCollection[] = await getAllExtendedCollections()
  const simpleCollections = collections.map((collection) => ({
    ...collection,
    editable_version: collection.editable_version.id,
  }))
  const user = await getUser()
  const profile = await getProfile(user.id)
  const name = profile.full_name || user.user_metadata.name
  return (
    <Page>
      <Navbar
        user={user}
        profile={profile}
        collection={undefined}
        collections={simpleCollections}
      />
      <MobileNavbar
        user={user}
        profile={profile}
        collection={undefined}
        collections={simpleCollections}
        blocking={true}
      />
      <Main>
        <div className="space-y-4">
          <Header
            title={name ? `Welcome, ${name}!` : 'Welcome!'}
            subtitle="While we're working hard to iron out any bugs, but you'll
        probably find some issues. Please bear with us and don't hesitate
        to reach out for questions or feedback on anything you'd like to
        see improved."
            showBreadcrumbs={false}
          />
        </div>
        {collections.length === 0 ? (
          <Segment
            title=""
            className="h-full p-0.5 pb-10"
            containerClassName="h-full"
          >
            <div className="grid h-full place-items-center rounded-lg border border-border border-dashed p-6">
              {/* <FirstCollection user={user} /> */}
              <EmptyCollectionsView>
                <NewCollectionDialog button={<CollectionCard />} />
              </EmptyCollectionsView>
            </div>
          </Segment>
        ) : (
          <Segment title="Collections" link="/studio/collections">
            <CardRow
              createButton={<NewCollectionDialog button={<CollectionCard />} />}
              cards={collections.map((collection) => {
                return {
                  component: (
                    <CollectionCard
                      key={collection.slug}
                      collection={collection}
                    />
                  ),
                  key: collection.slug,
                }
              })}
              className="grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-2"
            />
          </Segment>
        )}
      </Main>
    </Page>
  )
}
