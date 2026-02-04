import { getActionsForNav } from "@/lib/db/queries/actions";
import { getCollectionFromSlug } from "@/lib/db/queries/collections";
import { CollectionItems } from "./collection-items";
import { getAttributesForNav } from "@/lib/db/queries/attributes";
import { getLayersForNav } from "@/lib/db/queries/layers";

export async function CollectionParts({
  collection_slug,
}: { collection_slug: string }) {
  const collection = await getCollectionFromSlug(collection_slug);
  const version = collection.editableVersion;
  if (!version) throw new Error("No version");
  const attributePromise = getAttributesForNav(version);
  const actionPromise = getActionsForNav(collection.slug);
  const layerPromise = getLayersForNav(collection.slug);
  const navItems = await Promise.all([
    attributePromise,
    actionPromise,
    layerPromise,
  ]);

  return <CollectionItems collection={collection} navItems={navItems} />;
}
