"use client";

import DeleteButton from "@/components/forms/buttons/delete-button";
import { useAttribute } from "@/app/collections/[collection]/attributes/[attribute]/attribute-context";
import { deleteAttribute } from "@/lib/db/queries/attributes";
import { useCollection } from "@/app/collections/[collection]/collection-context";

export function DeleteAttributeButton() {
  const {
    attribute: { id, locked },
  } = useAttribute();
  const {
    collection: { slug: collectionSlug },
  } = useCollection();
  if (locked) return null;
  return (
    <DeleteButton
      title="attribute"
      disabled={locked}
      onDelete={async () => {
        await deleteAttribute(id, `/collections/${collectionSlug}/attributes`);
      }}
    />
  );
}
