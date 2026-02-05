"use client";

import type { NewUpload } from "@/lib/db/schema";
import {
  deleteUpload,
  insertUploads,
  revalidateUploads,
} from "@/lib/db/queries/uploads";
import type { RefObject } from "react";
import { uploadFile as uploadToBlob } from "@/lib/storage/uploaders";
import { BUCKETS } from "@/lib/storage";

import { RestrictionError } from "@uppy/core/lib/Restricter";
import { validImageExtensions, validImageTypes } from "./file-types";
import { toast } from "sonner";

type ImageType = "png" | "jpeg" | "jpg" | "gif" | "webp" | "svg+xml" | "avif";

export async function handleFileUpload(
  version: string,
  folder: string | null,
  files: File[] | null,
  fileInputRef: RefObject<HTMLInputElement | null> | null
): Promise<void> {
  if (!files) return;
  const fileMap: Record<string, File> = {};
  for (const file of files) {
    fileMap[crypto.randomUUID()] = file;
  }
  if (fileInputRef?.current) {
    fileInputRef.current.value = "";
    fileInputRef.current.files = null;
  }

  const res = await createLayerEntries(version, folder, fileMap);
  if (!res.ok) {
    toast.error(res.message);
    return;
  }
  const promises: Promise<string>[] = [];
  for (const [id, file] of Object.entries(fileMap)) {
    try {
      const promise = uploadFileToStorage(version, id, file);
      promises.push(promise);
    } catch (err) {
      if (err instanceof RestrictionError) {
        if (err.isUserFacing) {
          toast.error(err.message);
        }
      } else {
        throw err;
      }
    }
  }
  const consolidatedPromise = Promise.all(promises);
  toast.promise(consolidatedPromise, {
    loading: "Uploading...",
    success: () => {
      revalidateUploads();
      return "Successfully uploaded";
    },
    error: (error: string) => {
      return error;
    },
  });
}

export async function uploadFileToStorage(
  folder: string,
  fileId: string,
  file: File
): Promise<string> {
  const fileName = `${folder}/${fileId}`;

  try {
    const result = await uploadToBlob(file, {
      bucket: BUCKETS.UPLOADS,
      name: fileName,
    });

    if (!result.ok) {
      deleteUpload(fileId);
      throw new Error(result.message || "Upload failed");
    }

    return fileId;
  } catch (error) {
    deleteUpload(fileId);
    throw error;
  }
}

const verifyFile = (
  file: File,
  plural: boolean
): { type: ImageType; name: string; bytes: number } => {
  if (!file.type.startsWith("image/")) {
    throw new Error("File type must be an image");
  }
  const subtype = file.type.slice(6);
  if (!validImageTypes.includes(subtype as ImageType)) {
    throw new Error(
      plural
        ? "All files must be of a standard image type"
        : "File must be of a standard image type"
    );
  }
  if (file.name.length > 256) {
    throw new Error(
      plural
        ? "All files must be less than 256 characters"
        : "File must be less than 256 characters"
    );
  }
  if (file.size > 1024 * 1024 * 10) {
    //10 MB
    throw new Error(
      plural
        ? "All files must be less than 10 MB"
        : "File must be less than 10 MB"
    );
  }

  return { type: subtype as ImageType, name: file.name, bytes: file.size };
};

export async function createLayerEntries(
  version: string,
  folder: string | null,
  files: Record<string, File>
): Promise<{ ok: boolean; message?: string | null }> {
  const plural = Object.keys(files).length > 1;
  const layerEntries: NewUpload[] = [];
  for (const [id, file] of Object.entries(files)) {
    try {
      const { type, name, bytes } = verifyFile(file, plural);
      const possibleExtension = name.split(".").pop();
      let newName = name;
      if (
        possibleExtension &&
        validImageExtensions.includes(possibleExtension)
      ) {
        newName = name.split(".").slice(0, -1).join(".");
      }
      const { width, height } = await getImageDimensions(file);
      const layer: NewUpload = {
        id,
        version: version,
        folder: folder,
        name: newName,
        type,
        bytes,
        width,
        height,
      };
      layerEntries.push(layer);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return { ok: false, message: error.message };
      }
      return {
        ok: false,
        message: plural
          ? "Unknown error with one of the files"
          : "Unknown error with file",
      };
    }
  }

  return await insertUploads(layerEntries);
}

async function getImageDimensions(file: File) {
  const img = new Image();
  img.src = URL.createObjectURL(file);
  await img.decode();
  const width = img.width;
  const height = img.height;
  return {
    width,
    height,
  };
}
