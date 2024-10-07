import ActionNodeEditor from "@/components/elements/actions/action-node-editor";
import { getActionGraph } from "@/lib/supabase/db/action-graph";
import { getActionBySlug } from "@/lib/supabase/db/actions";
import { getAllAttributes } from "@/lib/supabase/db/attributes";
import { getExtendedCollectionFromSlug } from "@/lib/supabase/db/collections";

export default async function ActionPage({
  params: { collection, action },
}: {
  params: {
    collection: string;
    action: string;
  };
}) {
  const fullCollection = await getExtendedCollectionFromSlug(collection);
  const fullAction = await getActionBySlug(
    action,
    fullCollection.editable_version.id,
  );
  const graph = await getActionGraph(fullAction.id);
  const attributes = await getAllAttributes(fullCollection.editable_version.id);
  return (
    <div className="flex h-[calc(100svh-6rem)] w-full overflow-hidden bg-background md:h-[100svh] md:px-0">
      <ActionNodeEditor
        initialGraph={graph}
        version={fullCollection.editable_version}
        action={fullAction}
        attributes={attributes}
        collectionSlug={collection}
      />
    </div>
  );
}
