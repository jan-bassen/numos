'use server'

import { revalidatePath } from 'next/cache'
import { createSupabaseServerComponentClient } from '../clients/server-client'
import type {
  Folder,
  InsertFolder,
  InsertLayer,
  Layer,
  LayerTree,
  LegacyLayerTree,
  LegacyResolvedFolder,
  LegacyResolvedLayer,
  ResolvedFolder,
  ReturnInfo,
  ResolvedLayer,
  UpdateFolder,
  UpdateLayer,
} from '@/types/database.types'
import type { TreeSelection } from '@/app/collections/[collection]/image/layers/(components)/tree'
//TODO: Layer2 -> Layer

export async function revalidateLayers() {
  revalidatePath('/collections/[collection]/layers', 'page')
}

export async function insertLayers(layers: InsertLayer[]): Promise<ReturnInfo> {
  const supabase = await createSupabaseServerComponentClient()
  const { error } = await supabase.from('layers').insert(layers)
  if (error) {
    return { ok: false, message: error.message }
  }
  return { ok: true, message: 'Layers added' }
}

export async function updateLayer(
  id: string,
  layer: UpdateLayer,
): Promise<ReturnInfo> {
  const supabase = await createSupabaseServerComponentClient()
  const { error } = await supabase.from('layers').update(layer).eq('id', id)
  if (error) {
    return { ok: false, message: error.message }
  }
  revalidatePath('/collections/[collection]/layers', 'page')
  return { ok: true, message: 'Layer updated' }
}

export async function moveLayersAndFolders(
  layers: string[],
  folders: string[],
  folder: string | null,
) {
  const supabase = await createSupabaseServerComponentClient()
  const { error } = await supabase
    .from('layers')
    .update({ folder: folder })
    .in('id', layers)
  const { error: folderError } = await supabase
    .from('folders')
    .update({ parent: folder })
    .in('id', folders)

  if (error) {
    return { ok: false, message: error.message }
  }
  if (folderError) {
    return { ok: false, message: folderError.message }
  }
  revalidatePath('/collections/[collection]/layers', 'page')
  return { ok: true, message: 'Layers and folders moved' }
}

export async function deleteLayer(id: string): Promise<ReturnInfo> {
  const supabase = await createSupabaseServerComponentClient()
  const { error } = await supabase.from('layers').delete().eq('id', id)
  if (error) {
    return { ok: false, message: error.message }
  }
  revalidatePath('/collections/[collection]/layers', 'page')
  return { ok: true, message: 'Layer deleted' }
}

export async function deleteLayers(ids: string[]) {
  console.log(ids)
  const supabase = await createSupabaseServerComponentClient()
  const { error } = await supabase.from('layers').delete().in('id', ids)
  if (error) {
    return { ok: false, message: 'Error with deleting layer' }
  }
  revalidatePath('/collections/[collection]/layers', 'page')
  return { ok: true, message: 'Layers deleted' }
}

export async function insertFolder(folder: InsertFolder): Promise<ReturnInfo> {
  const supabase = await createSupabaseServerComponentClient()
  const { error } = await supabase.from('folders').insert(folder)
  if (error) {
    return { ok: false, message: error.message }
  }
  revalidatePath('/collections/[collection]/layers', 'page')
  return { ok: true, message: 'Successfully inserted folder' }
}

export async function updateFolder(
  id: string,
  folder: UpdateFolder,
): Promise<ReturnInfo> {
  const supabase = await createSupabaseServerComponentClient()
  const { error } = await supabase.from('folders').update(folder).eq('id', id)

  if (error) {
    return { ok: false, message: error.message }
  }
  revalidatePath('/collections/[collection]/layers', 'page')
  return { ok: true, message: 'Successfully updated folder' }
}

export async function deleteFolder(id: string): Promise<ReturnInfo> {
  const supabase = await createSupabaseServerComponentClient()
  const { data, error } = await supabase.from('folders').delete().eq('id', id)

  if (error) {
    return { ok: false, message: 'Error with deleting folder' }
  }
  revalidatePath('/collections/[collection]/layers', 'page')
  return { ok: true, message: 'Folder deleted' }
}

export async function deleteFolders(ids: string[]) {
  const supabase = await createSupabaseServerComponentClient()
  const { error } = await supabase.from('folders').delete().in('id', ids)
  if (error) {
    return { ok: false, message: 'Error with deleting folder' }
  }
  revalidatePath('/collections/[collection]/layers', 'page')
  return { ok: true, message: 'Folders deleted' }
}

export async function getAllLayers(collectionId: string) {
  const supabase = await createSupabaseServerComponentClient()
  const { data, error } = await supabase
    .from('layers')
    .select()
    .eq('collection', collectionId)
    .order('name', { ascending: true })

  if (error) {
    throw new Error('Error with fetching layers')
  }
  return data
}

export async function signLayers(
  collectionId: string,
  layers: Layer[],
): Promise<ResolvedLayer[]> {
  const supabase = await createSupabaseServerComponentClient()

  if (layers.length === 0) return []

  const paths = layers.map((layer) => {
    return `${collectionId}/${layer.id}`
  })

  const { data: signedUrlsData, error } = await supabase.storage
    .from('layers')
    .createSignedUrls(paths, 3600)

  if (error) {
    throw new Error(`Error with fetching signed urls: ${error.message}`)
  }
  return layers.map((layer, index) => {
    const signedUrlData = signedUrlsData[index]
    if (!signedUrlData) throw new Error('Signed url data not found')
    const { error, signedUrl } = signedUrlData
    if (error) {
      throw new Error(`Error with fetching signed url: ${error}`)
    }
    return {
      ...layer,
      signedUrl,
    }
  })
}

export async function getAllSignedLayers(collectionId: string) {
  const layers = await getAllLayers(collectionId)
  return signLayers(collectionId, layers)
}

export async function getAllFolders(collectionId: string) {
  const supabase = await createSupabaseServerComponentClient()
  const { data, error } = await supabase
    .from('folders')
    .select()
    .eq('collection', collectionId)
    .order('name', { ascending: true })

  if (error) {
    throw new Error('Error with fetching folders')
  }
  return data
}

export async function getLayerTree(collectionId: string): Promise<LayerTree> {
  const layers = await getAllSignedLayers(collectionId)
  const folders = await getAllFolders(collectionId)

  const signedLayerMap = layers.reduce(
    (acc, layer) => {
      acc[layer.id] = layer
      return acc
    },
    {} as Record<string, ResolvedLayer>,
  )

  const folderMap = folders.reduce(
    (acc, folder) => {
      acc[folder.id] = folder
      return acc
    },
    {} as Record<string, Folder>,
  )

  const resolvedFolderMap = folders.reduce(
    (acc, folder) => {
      const folderPath = []
      let nextParent = folder.parent
      while (nextParent) {
        folderPath.unshift(nextParent)
        const parent = folderMap[nextParent]
        if (!parent) {
          nextParent = null
          throw new Error('Reference to non-existing folder')
        }
        if (folder.id === parent.id || folder.id === parent.parent) {
          nextParent = null
          throw new Error('Reference to self')
        }
        nextParent = parent.parent
      }
      acc[folder.id] = {
        ...folder,
        subfolders: folders
          .filter((f) => f.parent === folder.id)
          .map((f) => f.id),
        layers: layers.filter((l) => l.folder === folder.id).map((l) => l.id),
        path: folderPath,
      }
      return acc
    },
    {} as Record<string, ResolvedFolder>,
  )

  return {
    folders: resolvedFolderMap,
    layers: signedLayerMap,
  }
}

export async function legacyGetLayerTree(
  collectionId: string,
): Promise<LegacyLayerTree> {
  const supabase = await createSupabaseServerComponentClient()

  //TODO: Get from single query
  const layers = await getAllLayers(collectionId)
  const folders = await getAllFolders(collectionId)

  const parentfolderMap: Record<
    string,
    { folders: Folder[]; layers: Layer[] }
  > = {}

  for (const folder of folders) {
    const existingEntry = parentfolderMap[folder.parent || 'top']
    parentfolderMap[folder.parent || 'top'] = {
      folders: [...(existingEntry?.folders || []), folder],
      layers: existingEntry?.layers || [],
    }
  }

  let signedUrls:
    | {
        error: string | null
        path: string | null
        signedUrl: string
      }[]
    | null = null

  if (layers.length !== 0) {
    for (const layer of layers) {
      const existingEntry = parentfolderMap[layer.folder || 'top']
      parentfolderMap[layer.folder || 'top'] = {
        folders: existingEntry?.folders || [],
        layers: [...(existingEntry?.layers || []), layer],
      }
    }

    const paths = layers.map((layer) => {
      return `${collectionId}/${layer.id}`
    })

    const { data, error: signedUrlsError } = await supabase.storage
      .from('layers')
      .createSignedUrls(paths, 3600)

    if (signedUrlsError) {
      throw new Error(
        `Error with fetching signed urls: ${signedUrlsError.message}`,
      )
    }

    signedUrls = data
  }

  const resolveLayer = (layer: Layer, index: number): LegacyResolvedLayer => {
    if (!signedUrls) throw new Error('No signed urls')
    const signedUrl =
      signedUrls.find((url) => url.path === `${collectionId}/${layer.id}`)
        ?.signedUrl || ''
    return {
      ...layer,
      globalIndex: index,
      signedUrl,
    }
  }

  const resolveFolder = (
    folder: Folder,
    parentPath: string,
    index: number,
  ): { resolvedFolder: LegacyResolvedFolder; nextIndex: number } => {
    const children = parentfolderMap[folder.id]
    const path = `${parentPath}/${folder.id}`
    const subfolders: LegacyResolvedFolder[] = []
    let nextIndex = index

    for (const subfolder of children?.folders || []) {
      const { resolvedFolder, nextIndex: subfolderResolved } = resolveFolder(
        subfolder,
        path,
        nextIndex + 1,
      )
      nextIndex = subfolderResolved - 1
      subfolders.push(resolvedFolder)
    }

    const layers = signedUrls
      ? children?.layers.map((layer, i) =>
          resolveLayer(layer, nextIndex + i + 1),
        ) || []
      : []

    return {
      resolvedFolder: {
        ...folder,
        globalIndex: index,
        path,
        subfolders,
        layers,
      },
      nextIndex: nextIndex + (children?.layers.length || 0) + 1,
    }
  }

  if (parentfolderMap.top === undefined) {
    parentfolderMap.top = {
      folders: [],
      layers: [],
    }
  }

  const treeFolders: LegacyResolvedFolder[] = []
  let nextGlobalIndex = 0

  for (const folder of parentfolderMap.top.folders) {
    let cumulativeIndex = 0
    const { resolvedFolder, nextIndex } = resolveFolder(
      folder,
      '',
      nextGlobalIndex,
    )
    cumulativeIndex = nextIndex
    nextGlobalIndex = cumulativeIndex
    treeFolders.push(resolvedFolder)
  }

  const tree: LegacyLayerTree = {
    folders: treeFolders,
    layers: parentfolderMap.top.layers.map((layer, i) =>
      resolveLayer(layer, nextGlobalIndex + i),
    ),
  }

  return tree
}
