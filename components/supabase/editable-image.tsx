"use client";

import { SupabaseImage } from "@/components/supabase/supabase-image";
import { uploadFile, type UploadLocation } from "@/lib/storage/uploaders";
import { BUCKETS, type BucketName } from "@/lib/storage";
import { PiPencilEditSolid } from "@repo/ui/icons/pika";
import { cn } from "@repo/ui/lib/utils";
import type { ImageProps } from "next/image";
import { type ChangeEvent, useRef, useState } from "react";

export type StorageLocation = {
  bucket: BucketName;
  name: string | null;
};

export function locationToFullPath(location: StorageLocation): string {
  return `${location.bucket}/${location.name}`;
}

export type EditableImageProps = {
  location: StorageLocation;
  uploadTo: StorageLocation;
  onUpload?: (location: StorageLocation) => Promise<void>;
  onUploadError?: (error: string) => void;
  locked?: boolean;
  options?: {
    placeholder?: boolean;
    keepExtension?: boolean;
    keepOld?: boolean;
  };
} & Omit<ImageProps, "src" | "placeholder">;

export function EditableImage({
  location,
  uploadTo,
  onUpload,
  onUploadError,
  className,
  locked = false,
  options,
  ...props
}: EditableImageProps) {
  const { keepOld, ...fileOptions } = options || {};

  const [fullPath, setFullPath] = useState<string | null>(
    location.name ? locationToFullPath(location) : null
  );

  const imageInputRef = useRef<HTMLInputElement>(null);

  async function upload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[event.target.files.length - 1];

    if (!file || !uploadTo.name) return;

    const uploadLocation: UploadLocation = {
      bucket: uploadTo.bucket,
      name: uploadTo.name,
    };

    const result = await uploadFile(file, uploadLocation, {
      keepExtension: fileOptions?.keepExtension,
      replaceExisting: keepOld ? null : location.name,
    });

    if (!result.ok) {
      onUploadError?.(result.message || "Upload failed");
    } else if (result.url) {
      const newLocation: StorageLocation = {
        bucket: uploadTo.bucket,
        name: uploadTo.name,
      };
      setFullPath(result.url);
      onUpload?.(newLocation);
    }
  }

  return (
    <div className="size-fit p-0">
      <input
        type="file"
        accept="image/*"
        id="image-input"
        disabled={locked}
        ref={imageInputRef}
        className="hidden"
        onChange={upload}
      />
      <button
        type="button"
        disabled={locked}
        onClick={() => imageInputRef.current?.click()}
        className="group grid place-items-center"
      >
        <>
          {!locked && (
            <PiPencilEditSolid className="z-10 col-span-1 col-start-1 row-span-1 row-start-1 size-5 stroke-1 stroke-muted-foreground text-background opacity-0 transition-opacity group-hover:opacity-100" />
          )}
          <SupabaseImage
            {...props}
            placeholder={fileOptions?.placeholder}
            src={fullPath}
            className={cn(
              "col-span-1 col-start-1 row-span-1 row-start-1 aspect-square rounded-md object-cover",
              className
            )}
          />
        </>
      </button>
    </div>
  );
}
