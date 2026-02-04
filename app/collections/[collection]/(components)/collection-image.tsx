"use client";

import { EditableImage } from "@/components/supabase/editable-image";
import { cn } from "@repo/ui/lib/utils";
import { toast } from "sonner";
import { useCollection } from "@/app/collections/[collection]/collection-context";

export function CollectionImage({ className }: { className?: string }) {
  const { collection, updateCollection } = useCollection();
  return (
    <EditableImage
      location={{
        bucket: "collection-images",
        name: collection.image ? `${collection.id}/${collection.image}` : null,
      }}
      uploadTo={{
        bucket: "collection-images",
        name: `${collection.id}/${crypto.randomUUID()}`,
      }}
      onUpload={async (location) => {
        // Extract just the filename from the full path
        const name = location.name?.split("/").pop() ?? null;
        const res = await updateCollection({
          image: name,
        });
        if (!res.ok) {
          toast.error(res.message);
        }
      }}
      onUploadError={(error) => {
        toast.error(error);
      }}
      options={{
        placeholder: true,
      }}
      alt="Collection Image"
      className={cn("size-20", className)}
      locked={collection.settings_locked}
      width={80}
      height={80}
    />
  );
}
