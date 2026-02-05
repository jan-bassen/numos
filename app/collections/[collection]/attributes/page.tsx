import Main from "@/components/page/main";
import { getAllAttributes } from "@/lib/db/queries/attributes";
import {
  getCollectionFromSlug,
  getVersionIdFromCollectionSlug,
} from "@/lib/db/queries/collections";
import { PiAddAddStroke } from "@repo/ui/icons/pika";
import { Button } from "@repo/ui/components/button";
import { NewAttributeDialog } from "@/app/collections/[collection]/attributes/(components)/new-attribute-dialog";
import {
  Header,
  HeaderActions,
  HeaderContent,
  HeaderMain,
  HeaderTitle,
} from "@/components/page/header";
import { Page } from "@/components/page/page";
import {
  ElementCardButton,
  ElementCardLink,
} from "@/components/elements/element-card";
import SimpleGrid from "@/components/layouts/simple/simple-grid";
import { dataTypes } from "@/lib/constants/datatypes";

export default async function AttributesPage(props: {
  params: Promise<{ collection: string; attribute: string }>;
}) {
  const { collection: collectionSlug } = await props.params;
  const collection = await getCollectionFromSlug(collectionSlug);
  if (!collection.editableVersion) {
    throw new Error("Collection has no editable version");
  }
  const attributes = await getAllAttributes(collection.editableVersion);

  return (
    <Page>
      <Header
        back={{
          href: `/collections/${collectionSlug}`,
          label: collection.name ?? "Collection",
        }}
      >
        <HeaderContent>
          <HeaderMain>
            <HeaderTitle>Attributes</HeaderTitle>
          </HeaderMain>
          <HeaderActions>
            <NewAttributeDialog versionId={collection.editableVersion}>
              <Button className="gap-1.5 pl-3">
                <PiAddAddStroke className="size-4" />
                New Attribute
              </Button>
            </NewAttributeDialog>
          </HeaderActions>
        </HeaderContent>
      </Header>
      <Main>
        <SimpleGrid>
          {attributes.map((attribute) => {
            return (
              <ElementCardLink
                key={attribute.id}
                href={`/collections/${collectionSlug}/attributes/${attribute.slug}`}
                label={attribute.name ?? "New Attribute"}
                subtitle={attribute.description}
                icon={attribute.value?.type ? dataTypes[attribute.value.type]?.icons.stroke : undefined}
              />
            );
          })}
          <NewAttributeDialog versionId={collection.editableVersion}>
            <ElementCardButton size="md" variant="new" label="New Attribute" />
          </NewAttributeDialog>
        </SimpleGrid>
      </Main>
    </Page>
  );
}
