import Main from "@/components/layout/pages/main";
import { getAttributeBySlug } from "@/lib/supabase/db/attributes";
import AttributeEditor from "../../../../../components/elements/attributes/attribute-editor";
import { getExtendedCollectionFromSlug } from "@/lib/supabase/db/collections";

export default async function Attribute({
  params,
}: {
  params: { collection: string; attribute: string };
}) {
  const collection = await getExtendedCollectionFromSlug(params.collection);
  const attribute =
    params.attribute === "new"
      ? undefined
      : await getAttributeBySlug(
          collection.editable_version.id,
          params.attribute,
        );
  return (
    <Main>
      <AttributeEditor
        attribute={attribute}
        collectionSlug={params.collection}
        version={collection.editable_version}
      />
    </Main>
  );
}
