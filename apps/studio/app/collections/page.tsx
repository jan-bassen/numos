import { getAllExtendedCollections } from '@/lib/supabase/db/collections'
import Main from '@/components/page/main'
import CollectionCard from './(components)/collection-card'
import CardRow from '@/components/layouts/simple/card-row'
import type { ExtendedCollection } from '@/types/database.types'
import { getProfile, getUser } from '@/lib/supabase/db/profile'
import { Navbar } from '@/components/navigation/navbar/navbar'
import Header from '@/components/page/header'
import EmptyCollectionsView from '@/app/collections/(components)/empty-collections-view'
import { NewCollectionDialog } from '@/app/collections/(components)/new-collection-dialog'
import { Button } from '@repo/ui/components/ui/button'
import { PiAddAddStroke } from '@repo/ui/icons/pika'
import Page from '@/components/page/page'

export default async function HomePage() {
  const collections: ExtendedCollection[] = await getAllExtendedCollections()
  const user = await getUser()
  const profile = await getProfile(user.id)
  const name = profile.full_name || user.user_metadata.name
  return (
    <>
      <Navbar />
      <Page>
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
            <div className="grid h-full place-items-center rounded-lg border border-border border-dashed p-6">
              <EmptyCollectionsView>
                <NewCollectionDialog
                  button={<Button>Create Collection</Button>}
                />
              </EmptyCollectionsView>
            </div>
          ) : (
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
          )}
        </Main>
      </Page>
    </>
  )
}
