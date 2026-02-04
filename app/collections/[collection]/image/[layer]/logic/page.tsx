import { getExtendedCollectionFromSlug } from "@/lib/db/queries/collections";
import { getAllAttributes } from "@/lib/db/queries/attributes";
import { getImageGraph } from "@/lib/db/queries/image-graph";
import ImageNodeEditor from "@/app/collections/[collection]/image/[layer]/logic/(components)/image-node-editor";
import { getUploadsTree } from "@/lib/db/queries/uploads";
import { getLayerBySlugs } from "@/lib/db/queries/layers";
import { notFound } from "next/navigation";

export default async function LayerLogicPage(props: {
  params: Promise<{ collection: string; layer: string }>;
}) {
  const params = await props.params;
  const collection = await getExtendedCollectionFromSlug(params.collection);

  const [attributes, layer, uploadsTree] = await Promise.all([
    getAllAttributes(collection.editableVersion.id),
    getLayerBySlugs(params.collection, params.layer),
    getUploadsTree(collection.editableVersion.id),
  ]);

  if (!layer) {
    notFound();
  }

  const graph = await getImageGraph(layer.id);

  return (
    <ImageNodeEditor
      initialGraph={graph}
      version={collection.editableVersion}
      uploads={uploadsTree}
      attributes={attributes}
      layer={layer}
      collectionSlug={params.collection}
    />
  );
}
