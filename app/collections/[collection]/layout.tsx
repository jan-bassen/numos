import { Navbar } from "@/components/navigation/navbar/navbar";
import { getExtendedCollectionFromSlug } from "@/lib/db/queries/collections";
import { CollectionProvider } from "@/app/collections/[collection]/collection-context";
import { VersionProvider } from "@/app/collections/[collection]/version-context";

export default async function Layout({
  params,
  children,
}: {
  children: React.ReactNode;
  params: Promise<{ collection: string }>;
}) {
  const { collection: collectionSlug } = await params;
  const extended_collection =
    await getExtendedCollectionFromSlug(collectionSlug);

  const version = extended_collection.editableVersion;
  const collection = {
    ...extended_collection,
    editable_version: version.id,
  };
  return (
    <CollectionProvider collection={collection}>
      <VersionProvider version={version}>
        <Navbar collection={collectionSlug} />
        {children}
      </VersionProvider>
    </CollectionProvider>
  );
}
