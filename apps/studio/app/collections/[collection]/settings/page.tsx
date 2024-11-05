import Main from "@/components/layout/pages/main";
import {
  getAllVersions,
  getExtendedCollectionFromSlug,
} from "@/lib/supabase/db/collections";
import CollectionEditor from "../../../../components/elements/collections/collection-editor";

export default async function CollectionSettingsPage(
  props: {
    params: Promise<{ collection: string }>;
  }
) {
  const params = await props.params;
  const collection = await getExtendedCollectionFromSlug(params.collection);
  return (
    <Main>
      <CollectionEditor collection={collection} />
    </Main>
  );
}
