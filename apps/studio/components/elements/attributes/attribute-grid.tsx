import { Attribute } from "@/types/database.types";
import AttributeCard from "./attribute-card";
import { cn } from "@/lib/utils";
import { NewAttributeDialog } from "./new-attribute-dialog";

export default function AttributeGrid({
  attributes,
  collectionSlug,
  versionId,
  className,
}: {
  attributes: Attribute[];
  collectionSlug: string;
  versionId: string;
  className?: string;
}) {
  return (
    <ul className={cn("grid gap-2 lg:grid-cols-2 xl:grid-cols-3", className)}>
      {attributes.map((attribute) => {
        return (
          <AttributeCard
            key={attribute.slug}
            attribute={attribute}
            collectionSlug={collectionSlug}
          />
        );
      })}
      <NewAttributeDialog
        button={<AttributeCard key="new" collectionSlug={collectionSlug} />}
        versionId={versionId}
        collectionSlug={collectionSlug}
      />
    </ul>
  );
}
