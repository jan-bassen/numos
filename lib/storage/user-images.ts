"use server";

import { put, del, list } from "@vercel/blob";
import { BUCKETS, type ReturnInfo } from "./index";
import { revalidatePath } from "next/cache";

const BUCKET = BUCKETS.USER_IMAGES;

export type ImageFile = {
  url: string;
  pathname: string;
  size: number;
  uploadedAt: Date;
};

// Get all files at a path
export async function getFilesAtPath(
  collectionId: string,
  path?: string
): Promise<ImageFile[]> {
  const prefix = path
    ? `${BUCKET}/${collectionId}/${path}/`
    : `${BUCKET}/${collectionId}/`;

  const result = await list({ prefix });

  return result.blobs.map((blob) => ({
    url: blob.url,
    pathname: blob.pathname,
    size: blob.size,
    uploadedAt: blob.uploadedAt,
  }));
}

// Get all user images (flattened)
export async function getAllUserImages(
  collectionId: string
): Promise<ImageFile[]> {
  const prefix = `${BUCKET}/${collectionId}/`;
  const result = await list({ prefix });

  return result.blobs.map((blob) => ({
    url: blob.url,
    pathname: blob.pathname,
    size: blob.size,
    uploadedAt: blob.uploadedAt,
  }));
}

// Get signed URLs for images
export async function getUserImageURLs(
  collectionId: string,
  paths: string[]
): Promise<string[]> {
  // Vercel Blob URLs are already public/accessible
  return paths.map((path) => `${BUCKET}/${collectionId}/${path}`);
}

// Upload an image
export async function uploadImage(
  collectionId: string,
  path: string,
  file: File | Blob
): Promise<ReturnInfo & { url?: string }> {
  try {
    const fullPath = `${BUCKET}/${collectionId}/${path}`;
    const result = await put(fullPath, file, { access: "public" });
    return { ok: true, message: "Image uploaded", url: result.url };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Upload failed",
    };
  }
}

// Delete an image
export async function deleteImage(
  collectionId: string,
  path: string
): Promise<ReturnInfo> {
  try {
    const fullPath = `${BUCKET}/${collectionId}/${path}`;
    await del(fullPath);
    revalidatePath("/collections/[collection]/uploads", "page");
    return { ok: true, message: "Image deleted" };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Delete failed",
    };
  }
}

// Delete multiple images
export async function deleteImages(
  collectionId: string,
  paths: string[]
): Promise<ReturnInfo> {
  try {
    const fullPaths = paths.map((path) => `${BUCKET}/${collectionId}/${path}`);
    await Promise.all(fullPaths.map((path) => del(path)));
    revalidatePath("/collections/[collection]/uploads", "page");
    return { ok: true, message: "Images deleted" };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Delete failed",
    };
  }
}

// Move an image
export async function moveImage(
  collectionId: string,
  oldPath: string,
  newPath: string
): Promise<ReturnInfo> {
  try {
    // Vercel Blob doesn't have a native move operation
    // We need to copy and delete
    const oldFullPath = `${BUCKET}/${collectionId}/${oldPath}`;
    const newFullPath = `${BUCKET}/${collectionId}/${newPath}`;

    // Fetch the old file
    const response = await fetch(oldFullPath);
    if (!response.ok) {
      throw new Error("Failed to fetch original file");
    }

    const blob = await response.blob();

    // Upload to new location
    await put(newFullPath, blob, { access: "public" });

    // Delete old file
    await del(oldFullPath);

    revalidatePath("/collections/[collection]/uploads", "page");
    return { ok: true, message: "Image moved" };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Move failed",
    };
  }
}

// Delete a folder (all files with prefix)
export async function deleteFolder(
  collectionId: string,
  path?: string
): Promise<ReturnInfo> {
  try {
    const prefix = path
      ? `${BUCKET}/${collectionId}/${path}/`
      : `${BUCKET}/${collectionId}/`;

    const result = await list({ prefix });
    const urls = result.blobs.map((blob) => blob.url);

    if (urls.length > 0) {
      await Promise.all(urls.map((url) => del(url)));
    }

    revalidatePath("/collections/[collection]/uploads", "page");
    return { ok: true, message: "Folder deleted" };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Delete failed",
    };
  }
}

// Get signed upload URL for direct client uploads
export async function getSignedUploadURL(
  collectionId: string,
  path: string
): Promise<ReturnInfo & { uploadUrl?: string }> {
  // Vercel Blob uses client-side uploads via the put function
  // For server-generated upload URLs, you'd typically use a different approach
  // For now, return a placeholder - actual implementation would use @vercel/blob/client
  return {
    ok: true,
    message: "Use client-side upload",
    uploadUrl: undefined,
  };
}
