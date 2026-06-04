'use client'

/**
 * Client-side, ephemeral data store backing the studio demo.
 *
 * Replaces the Supabase/Postgres backend with a per-visitor IndexedDB database.
 * One object store per entity (keyed by `id`), plus an out-of-line `upload_blobs`
 * store holding the raw image `Blob`s for the uploads feature. Everything is
 * seeded on first load (see `./seed`) and resets when the visitor clears site data.
 */

export const DB_NAME = 'numos-studio'
const DB_VERSION = 1

/** Entity stores keyed by `id`. */
export const ENTITY_STORES = [
  'accounts',
  'profiles',
  'collections',
  'versions',
  'attributes',
  'actions',
  'action_nodes',
  'action_connections',
  'action_issues',
  'layers',
  'image_nodes',
  'image_connections',
  'uploads',
  'folders',
] as const

/** Store holding raw upload blobs, keyed (out-of-line) by upload id. */
export const BLOB_STORE = 'upload_blobs'

export type EntityStore = (typeof ENTITY_STORES)[number]

let dbPromise: Promise<IDBDatabase> | null = null

function isBrowser() {
  return typeof window !== 'undefined' && typeof indexedDB !== 'undefined'
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onupgradeneeded = () => {
      const db = request.result
      for (const name of ENTITY_STORES) {
        if (!db.objectStoreNames.contains(name)) {
          db.createObjectStore(name, { keyPath: 'id' })
        }
      }
      if (!db.objectStoreNames.contains(BLOB_STORE)) {
        db.createObjectStore(BLOB_STORE)
      }
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

function getDb(): Promise<IDBDatabase> {
  if (!isBrowser()) {
    return Promise.reject(
      new Error('IndexedDB is only available in the browser'),
    )
  }
  if (!dbPromise) {
    dbPromise = openDb()
  }
  return dbPromise
}

function promisify<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

function txDone(tx: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
    tx.onabort = () => reject(tx.error)
  })
}

/** Generate a new entity id. */
export function newId(): string {
  return crypto.randomUUID()
}

export async function getAll<T>(store: EntityStore): Promise<T[]> {
  const db = await getDb()
  const tx = db.transaction(store, 'readonly')
  return promisify(tx.objectStore(store).getAll() as IDBRequest<T[]>)
}

export async function get<T>(
  store: EntityStore,
  id: string,
): Promise<T | undefined> {
  const db = await getDb()
  const tx = db.transaction(store, 'readonly')
  return promisify(tx.objectStore(store).get(id) as IDBRequest<T | undefined>)
}

export async function getAllBy<T extends Record<string, unknown>>(
  store: EntityStore,
  field: keyof T,
  value: unknown,
): Promise<T[]> {
  const rows = await getAll<T>(store)
  return rows.filter((row) => row[field] === value)
}

export async function put<T>(store: EntityStore, row: T): Promise<T> {
  const db = await getDb()
  const tx = db.transaction(store, 'readwrite')
  tx.objectStore(store).put(row)
  await txDone(tx)
  return row
}

export async function bulkPut<T>(store: EntityStore, rows: T[]): Promise<void> {
  if (rows.length === 0) return
  const db = await getDb()
  const tx = db.transaction(store, 'readwrite')
  const objectStore = tx.objectStore(store)
  for (const row of rows) {
    objectStore.put(row)
  }
  await txDone(tx)
}

export async function remove(store: EntityStore, id: string): Promise<void> {
  const db = await getDb()
  const tx = db.transaction(store, 'readwrite')
  tx.objectStore(store).delete(id)
  await txDone(tx)
}

export async function removeMany(
  store: EntityStore,
  ids: string[],
): Promise<void> {
  if (ids.length === 0) return
  const db = await getDb()
  const tx = db.transaction(store, 'readwrite')
  const objectStore = tx.objectStore(store)
  for (const id of ids) {
    objectStore.delete(id)
  }
  await txDone(tx)
}

export async function removeBy<T extends Record<string, unknown>>(
  store: EntityStore,
  field: keyof T,
  value: unknown,
): Promise<void> {
  const rows = await getAllBy<T>(store, field, value)
  await removeMany(
    store,
    rows.map((row) => row.id as string),
  )
}

/**
 * Read-modify-write a single row by id, merging `patch` into it.
 * Returns the updated row, or `undefined` if it didn't exist.
 */
export async function patch<T extends { id: string }>(
  store: EntityStore,
  id: string,
  values: Record<string, unknown>,
): Promise<T | undefined> {
  const existing = await get<T>(store, id)
  if (!existing) return undefined
  const updated = { ...existing, ...values, id } as T
  await put(store, updated)
  return updated
}

// --- upload blobs (out-of-line keyed by upload id) ---

export async function putBlob(id: string, blob: Blob): Promise<void> {
  const db = await getDb()
  const tx = db.transaction(BLOB_STORE, 'readwrite')
  tx.objectStore(BLOB_STORE).put(blob, id)
  await txDone(tx)
}

export async function getBlob(id: string): Promise<Blob | undefined> {
  const db = await getDb()
  const tx = db.transaction(BLOB_STORE, 'readonly')
  return promisify(tx.objectStore(BLOB_STORE).get(id) as IDBRequest<Blob>)
}

export async function removeBlob(id: string): Promise<void> {
  const db = await getDb()
  const tx = db.transaction(BLOB_STORE, 'readwrite')
  tx.objectStore(BLOB_STORE).delete(id)
  await txDone(tx)
}

/** Wipe every store — used by the "start over" reset affordance. */
export async function clearAll(): Promise<void> {
  const db = await getDb()
  const names = [...ENTITY_STORES, BLOB_STORE]
  const tx = db.transaction(names, 'readwrite')
  for (const name of names) {
    tx.objectStore(name).clear()
  }
  await txDone(tx)
}
