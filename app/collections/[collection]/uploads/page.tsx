import { getCollectionFromSlug } from "@/lib/db/queries/collections";
import UploadsTreeView from "@/app/collections/[collection]/uploads/(components)/tree";
import { getUploadsTree } from "@/lib/db/queries/uploads";

export default async function LayerPage(props: {
  params: Promise<{ collection: string }>;
}) {
  const params = await props.params;
  const collection = await getCollectionFromSlug(params.collection);
  if (!collection.editableVersion) return null;
  const tree = await getUploadsTree(collection.editableVersion);
  return <UploadsTreeView collection={collection} tree={tree} />;
}
