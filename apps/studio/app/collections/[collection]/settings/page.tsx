import Main from "@/components/layout/pages/main";
import {
  getAllVersions,
  getExtendedCollectionFromSlug,
} from "@/lib/supabase/db/collections";
import CollectionEditor from "../../../../components/elements/collections/collection-editor";

export default async function CollectionSettingsPage({
  params,
}: {
  params: { collection: string };
}) {
  const collection = await getExtendedCollectionFromSlug(params.collection);
  return (
    <Main>
      <CollectionEditor collection={collection} />
    </Main>
  );
}
