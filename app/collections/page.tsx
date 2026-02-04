import { getAllExtendedCollections, type ExtendedCollection } from "@/lib/db/queries/collections";
import Main from "@/components/page/main";
import { Navbar } from "@/components/navigation/navbar/navbar";
import {
  Header,
  HeaderActions,
  HeaderContent,
  HeaderMain,
  HeaderTitle,
} from "@/components/page/header";
import EmptyCollectionsView from "@/app/collections/(components)/empty-collections-view";
import { NewCollectionDialog } from "@/app/collections/(components)/new-collection-dialog";
import { Button } from "@repo/ui/components/button";
import { PiAddAddStroke } from "@repo/ui/icons/pika";
import { Page } from "@/components/page/page";
import SimpleGrid from "@/components/layouts/simple/simple-grid";
import {
  ElementCardButton,
  ElementCardLink,
} from "@/components/elements/element-card";
import { SupabaseImage } from "@/components/supabase/supabase-image";
import CollectionContextMenu from "@/app/collections/(components)/collection-context-menu";

export default async function HomePage() {
  const collections: ExtendedCollection[] = await getAllExtendedCollections();
  return (
    <>
      <Navbar />
      <Page>
        <Header hideBreadcrumbs>
          <HeaderContent>
            <HeaderMain>
              <HeaderTitle>Collections</HeaderTitle>
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
                  <CollectionContextMenu
                    key={collection.slug}
                    slug={collection.slug}
                  >
                    <ElementCardLink
                      href={`/collections/${collection.slug}`}
                      label={collection.name ?? "Unnamed Collection"}
                      subtitle={collection.description}
                      image={
                        <SupabaseImage
                          src={`collection-images/${collection.id}/${collection.image}`}
                          placeholder
                          alt="Collection Image"
                          width={100}
                          height={100}
                          className="h-full object-cover"
                        />
                      }
                    />
                  </CollectionContextMenu>
                );
              })}
              <NewCollectionDialog>
                <ElementCardButton label="New Collection" variant="new" />
              </NewCollectionDialog>
            </SimpleGrid>
          )}
        </Main>
      </Page>
    </>
  );
}
