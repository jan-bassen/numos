import { put, del, list, head } from "@vercel/blob";

export type BlobUploadResult = {
  url: string;
  pathname: string;
  contentType: string;
  contentDisposition: string;
};

export type ReturnInfo = {
  ok: boolean;
  message: string | null;
};

// Re-export Vercel Blob functions
export { put, del, list, head };

// Bucket prefixes (simulated via path prefixes in Vercel Blob)
export const BUCKETS = {
  UPLOADS: "uploads",
  USER_IMAGES: "user-images",
  COLLECTION_IMAGES: "collection-images",
  AVATARS: "avatars",
} as const;

export type BucketName = (typeof BUCKETS)[keyof typeof BUCKETS];

// Helper to construct blob paths with bucket prefix
export function getBlobPath(bucket: BucketName, path: string): string {
  return `${bucket}/${path}`;
}

// Upload a file to a bucket
export async function uploadToBucket(
  bucket: BucketName,
  path: string,
  file: File | Blob | ArrayBuffer | Buffer,
  options?: {
    contentType?: string;
    access?: "public";
  }
): Promise<BlobUploadResult> {
  const fullPath = getBlobPath(bucket, path);
  const result = await put(fullPath, file, {
    access: options?.access ?? "public",
    contentType: options?.contentType,
  });

  return {
    url: result.url,
    pathname: result.pathname,
    contentType: result.contentType,
    contentDisposition: result.contentDisposition,
  };
}

// Delete a file from a bucket
export async function deleteFromBucket(
  bucket: BucketName,
  path: string
): Promise<ReturnInfo> {
  try {
    const fullPath = getBlobPath(bucket, path);
    await del(fullPath);
    return { ok: true, message: "File deleted" };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to delete file",
    };
  }
}

// List files in a bucket with optional prefix
export async function listBucketFiles(
  bucket: BucketName,
  options?: {
    prefix?: string;
    limit?: number;
    cursor?: string;
  }
) {
  const prefix = options?.prefix
    ? getBlobPath(bucket, options.prefix)
    : `${bucket}/`;

  return list({
    prefix,
    limit: options?.limit,
    cursor: options?.cursor,
  });
}

// Get file metadata
export async function getFileMetadata(bucket: BucketName, path: string) {
  const fullPath = getBlobPath(bucket, path);
  return head(fullPath);
}

// Generate a public URL for a file
export function getPublicUrl(bucket: BucketName, path: string): string {
  // Vercel Blob URLs are already public
  // This function constructs the expected URL pattern
  const blobStoreUrl = process.env.BLOB_STORE_URL;
  if (!blobStoreUrl) {
    throw new Error("BLOB_STORE_URL environment variable not set");
  }
  return `${blobStoreUrl}/${bucket}/${path}`;
}
