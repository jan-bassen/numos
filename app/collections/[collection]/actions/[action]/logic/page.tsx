import ActionNodeEditor from "@/app/collections/[collection]/actions/[action]/logic/(components)/action-node-editor";
import { getActionGraph } from "@/lib/db/queries/action-graph";
import { getActionBySlug } from "@/lib/db/queries/actions";
import { getAllAttributes } from "@/lib/db/queries/attributes";
import { getExtendedCollectionFromSlug } from "@/lib/db/queries/collections";

export default async function ActionPage(props: {
  params: Promise<{
    collection: string;
    action: string;
  }>;
}) {
  const params = await props.params;

  const { collection: collectionSlug, action: actionSlug } = params;

  const collection = await getExtendedCollectionFromSlug(collectionSlug);
  const action = await getActionBySlug(
    actionSlug,
    collection.editableVersion.id
  );
  const graph = await getActionGraph(action.id);
  const attributes = await getAllAttributes(collection.editableVersion.id);
  return (
    <ActionNodeEditor
      initialGraph={graph}
      version={collection.editableVersion}
      action={action}
      attributes={attributes}
      collectionSlug={collectionSlug}
    />
  );
}
