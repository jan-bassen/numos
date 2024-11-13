import { getAllExtendedCollections } from '@/lib/supabase/db/collections'
import Main from '@/components/layout/pages/new-main'
import CollectionCard from '../../components/elements/collections/collection-card'
import Segment from '@/components/layout/elements/segment'
import CardRow from '@/components/layout/elements/card-row'
import type { ExtendedCollection } from '@/types/database.types'
import { getProfile, getUser } from '@/lib/supabase/db/profile'
import { Navbar } from '@/components/nav/navbar/navbar'
import Header from '@/components/layout/pages/new-header'
import EmptyCollectionsView from '@/components/elements/collections/empty-collection-view'
import { NewCollectionDialog } from '@/components/elements/collections/new-collection-dialog'
import { Button } from '@repo/ui/components/ui/button'
import { PiAddAddStroke } from '@repo/ui/icons/pika'

export default async function HomePage() {
  const collections: ExtendedCollection[] = await getAllExtendedCollections()
  const user = await getUser()
  const profile = await getProfile(user.id)
  const name = profile.full_name || user.user_metadata.name
  return (
    <>
      <Navbar />
      <div className="flex min-h-full w-full flex-col overflow-y-auto overflow-x-hidden">
        <Header
          title={name ? `Welcome, ${name}!` : 'Welcome!'}
          subtitle="While we're working hard to iron out any bugs, but you'll
        probably find some issues. Please bear with us and don't hesitate
        to reach out for questions or feedback on anything you'd like to
        see improved."
          showBreadcrumbs={false}
        >
          <NewCollectionDialog
            button={
              <Button className="gap-1.5 pl-3">
                <PiAddAddStroke className="size-4" />
                New Collection
              </Button>
            }
          />
        </Header>
        <Main>
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
            <Segment title="Collections" link="/collections">
              <CardRow
                createButton={
                  <NewCollectionDialog button={<CollectionCard />} />
                }
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
      </div>
    </>
  )
}
