"use server";

import { put, del } from "@vercel/blob";
import { BUCKETS, type BucketName, type ReturnInfo } from "./index";

export type UploadLocation = {
  bucket: BucketName;
  name: string;
};

export type UploadOptions = {
  keepExtension?: boolean;
  replaceExisting?: string | null;
};

// Upload a file to storage
export async function uploadFile(
  file: File,
  location: UploadLocation,
  options?: UploadOptions
): Promise<ReturnInfo & { url?: string }> {
  try {
    // Delete existing file if replacing
    if (options?.replaceExisting) {
      try {
        await del(`${location.bucket}/${options.replaceExisting}`);
      } catch {
        // Ignore delete errors for non-existent files
      }
    }

    // Construct the path
    let path = location.name;
    if (options?.keepExtension && file.name) {
      const ext = file.name.split(".").pop();
      if (ext) {
        path = `${path}.${ext}`;
      }
    }

    const fullPath = `${location.bucket}/${path}`;

    const result = await put(fullPath, file, {
      access: "public",
      contentType: file.type,
    });

    return {
      ok: true,
      message: "File uploaded successfully",
      url: result.url,
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Upload failed",
    };
  }
}

// Delete a file from storage
export async function deleteFile(
  location: UploadLocation
): Promise<ReturnInfo> {
  try {
    await del(`${location.bucket}/${location.name}`);
    return { ok: true, message: "File deleted" };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Delete failed",
    };
  }
}

// Batch delete files
export async function deleteFiles(
  locations: UploadLocation[]
): Promise<ReturnInfo> {
  try {
    const paths = locations.map((loc) => `${loc.bucket}/${loc.name}`);
    await Promise.all(paths.map((path) => del(path)));
    return { ok: true, message: "Files deleted" };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Delete failed",
    };
  }
}
