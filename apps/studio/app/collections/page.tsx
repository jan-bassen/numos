import { getAllExtendedCollections } from '@/lib/supabase/db/collections'
import Main from '@/components/page/main'
import type { ExtendedCollection } from '@/types/database.types'
import { Navbar } from '@/components/navigation/navbar/navbar'
import {
  Header,
  HeaderActions,
  HeaderContent,
  HeaderMain,
  HeaderTitle,
} from '@/components/page/header'
import EmptyCollectionsView from '@/app/collections/(components)/empty-collections-view'
import { NewCollectionDialog } from '@/app/collections/(components)/new-collection-dialog'
import { Button } from '@repo/ui/components/ui/button'
import { PiAddAddStroke } from '@repo/ui/icons/pika'
import { Page } from '@/components/page/page'
import SimpleGrid from '@/components/layouts/simple/simple-grid'
import {
  ElementCardButton,
  ElementCardLink,
} from '@/components/elements/element-card'
import { SupabaseImage } from '@/components/supabase/supabase-image'

export default async function HomePage() {
  const collections: ExtendedCollection[] = await getAllExtendedCollections()
  return (
    <>
      <Navbar />
      <Page>
        <Header hideBreadcrumbs>
          <HeaderContent>
            <HeaderMain>
              <HeaderTitle>NUMOS STUDIO</HeaderTitle>
            </HeaderMain>
            <HeaderActions>
              <NewCollectionDialog>
                <Button className="gap-1.5 pl-3">
                  <PiAddAddStroke className="size-4" />
                  New Collection
                </Button>
              </NewCollectionDialog>
            </HeaderActions>
          </HeaderContent>
        </Header>
        <Main>
          {collections.length === 0 ? (
            <div className="grid h-full place-items-center rounded-lg border border-border border-dashed p-6">
              <EmptyCollectionsView>
                <NewCollectionDialog>
                  <Button>Create Collection</Button>
                </NewCollectionDialog>
              </EmptyCollectionsView>
            </div>
          ) : (
            <SimpleGrid>
              {collections.map((collection) => {
                return (
                  <ElementCardLink
                    key={collection.slug}
                    href={`/collections/${collection.slug}`}
                    label={collection.name ?? 'Unnamed Collection'}
                    subtitle={collection.description}
                    image={
                      <SupabaseImage
                        src={
                          collection.image
                            ? `collection-images/${collection.image}`
                            : undefined
                        }
                        alt="Collection Image"
                        width={100}
                        height={100}
                        className="h-full object-cover"
                      />
                    }
                  />
                )
              })}
              <NewCollectionDialog>
                <ElementCardButton label="New Collection" variant="new" />
              </NewCollectionDialog>
            </SimpleGrid>
          )}
        </Main>
      </Page>
    </>
  )
}
