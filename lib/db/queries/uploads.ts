"use server";

import { eq, inArray, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { uploads, folders } from "@/lib/db/schema";
import type {
  Upload,
  NewUpload,
  Folder,
  NewFolder,
} from "@/lib/db/schema";
import type { ReturnInfo } from "./types";

export type ResolvedUpload = Upload & {
  signedUrl: string;
};

export type ResolvedFolder = Folder & {
  path: string[];
  subfolders: string[];
  uploads: string[];
};

export type UploadsTree = {
  folders: Record<string, ResolvedFolder>;
  uploads: Record<string, ResolvedUpload>;
};

export type UpdateUpload = Partial<Upload>;
export type UpdateFolder = Partial<Folder>;

// Utility
export async function revalidateUploads() {
  revalidatePath("/collections/[collection]/layers", "page");
}

// Read operations
export async function getAllUploads(version: string): Promise<Upload[]> {
  return db.query.uploads.findMany({
    where: eq(uploads.version, version),
    orderBy: [asc(uploads.name)],
  });
}

export async function getAllFolders(version: string): Promise<Folder[]> {
  return db.query.folders.findMany({
    where: eq(folders.version, version),
    orderBy: [asc(folders.name)],
  });
}

// Note: signUploads will need to be reimplemented with Vercel Blob
// For now, we return uploads without signed URLs
export async function getAllSignedUploads(
  version: string
): Promise<ResolvedUpload[]> {
  const uploadsList = await getAllUploads(version);
  // TODO: Implement with Vercel Blob signed URLs
  return uploadsList.map((upload) => ({
    ...upload,
    signedUrl: "", // Placeholder - will be implemented with Vercel Blob
  }));
}

export async function getUploadsTree(version: string): Promise<UploadsTree> {
  const uploadsList = await getAllSignedUploads(version);
  const foldersList = await getAllFolders(version);

  const signedUploadMap = uploadsList.reduce(
    (acc, upload) => {
      acc[upload.id] = upload;
      return acc;
    },
    {} as Record<string, ResolvedUpload>
  );

  const folderMap = foldersList.reduce(
    (acc, folder) => {
      acc[folder.id] = folder;
      return acc;
    },
    {} as Record<string, Folder>
  );

  const resolvedFolderMap = foldersList.reduce(
    (acc, folder) => {
      const folderPath: string[] = [];
      let nextParent = folder.parent;

      while (nextParent) {
        folderPath.unshift(nextParent);
        const parent = folderMap[nextParent];
        if (!parent) {
          nextParent = null;
          throw new Error("Reference to non-existing folder");
        }
        if (folder.id === parent.id || folder.id === parent.parent) {
          nextParent = null;
          throw new Error("Reference to self");
        }
        nextParent = parent.parent;
      }

      acc[folder.id] = {
        ...folder,
        subfolders: foldersList
          .filter((f) => f.parent === folder.id)
          .map((f) => f.id),
        uploads: uploadsList
          .filter((u) => u.folder === folder.id)
          .map((u) => u.id),
        path: folderPath,
      };
      return acc;
    },
    {} as Record<string, ResolvedFolder>
  );

  return {
    folders: resolvedFolderMap,
    uploads: signedUploadMap,
  };
}

// Write operations
export async function insertUploads(
  uploadsData: NewUpload[]
): Promise<ReturnInfo> {
  try {
    await db.insert(uploads).values(uploadsData);
    return { ok: true, message: "Layers added" };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function updateUpload(
  id: string,
  upload: UpdateUpload
): Promise<ReturnInfo> {
  try {
    await db.update(uploads).set(upload).where(eq(uploads.id, id));
    revalidatePath("/collections/[collection]/uploads", "page");
    return { ok: true, message: "Layer updated" };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function insertFolder(folder: NewFolder): Promise<ReturnInfo> {
  try {
    await db.insert(folders).values(folder);
    revalidatePath("/collections/[collection]/uploads", "page");
    return { ok: true, message: "Successfully inserted folder" };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function updateFolder(
  id: string,
  folder: UpdateFolder
): Promise<ReturnInfo> {
  try {
    await db.update(folders).set(folder).where(eq(folders.id, id));
    revalidatePath("/collections/[collection]/uploads", "page");
    return { ok: true, message: "Successfully updated folder" };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function moveUploadsAndFolders(
  uploadIds: string[],
  folderIds: string[],
  targetFolder: string | null
): Promise<ReturnInfo> {
  try {
    if (uploadIds.length > 0) {
      await db
        .update(uploads)
        .set({ folder: targetFolder })
        .where(inArray(uploads.id, uploadIds));
    }

    if (folderIds.length > 0) {
      await db
        .update(folders)
        .set({ parent: targetFolder })
        .where(inArray(folders.id, folderIds));
    }

    revalidatePath("/collections/[collection]/uploads", "page");
    return { ok: true, message: "Layers and folders moved" };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Delete operations
export async function deleteUpload(id: string): Promise<ReturnInfo> {
  try {
    await db.delete(uploads).where(eq(uploads.id, id));
    revalidatePath("/collections/[collection]/uploads", "page");
    return { ok: true, message: "Layer deleted" };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function deleteUploads(ids: string[]): Promise<ReturnInfo> {
  try {
    await db.delete(uploads).where(inArray(uploads.id, ids));
    revalidatePath("/collections/[collection]/uploads", "page");
    return { ok: true, message: "Uploads deleted" };
  } catch (error) {
    return {
      ok: false,
      message: "Error with deleting uploads",
    };
  }
}

export async function deleteFolder(id: string): Promise<ReturnInfo> {
  try {
    await db.delete(folders).where(eq(folders.id, id));
    revalidatePath("/collections/[collection]/uploads", "page");
    return { ok: true, message: "Folder deleted" };
  } catch (error) {
    return {
      ok: false,
      message: "Error with deleting folder",
    };
  }
}

export async function deleteFolders(ids: string[]): Promise<ReturnInfo> {
  try {
    await db.delete(folders).where(inArray(folders.id, ids));
    revalidatePath("/collections/[collection]/uploads", "page");
    return { ok: true, message: "Folders deleted" };
  } catch (error) {
    return {
      ok: false,
      message: "Error with deleting folder",
    };
  }
}
