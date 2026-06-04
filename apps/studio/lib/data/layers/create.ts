import { FetchError } from '@/lib/errors'
import type {
  InsertLayer,
  Layer,
  UnorderedInsertLayer,
} from '@/types/database.types'
import { hrefRegex, type ReturnInfo } from '@repo/ui/lib/utils'
import { getAllBy, newId, put } from '@/lib/data/store'

const now = () => new Date().toISOString()

export async function insertLayer(layer: InsertLayer): Promise<ReturnInfo> {
  if (!layer.slug) {
    return { ok: false, message: 'No slug defined' }
  }
  if (!hrefRegex.test(layer.slug)) {
    return {
      ok: false,
      message: 'Slug can only contain lowercase letters, numbers, and dashes',
    }
  }

  const existing = await getAllBy<Layer>('layers', 'version', layer.version)
  if (existing.some((l) => l.slug === layer.slug)) {
    return { ok: false, message: 'Slug already exists' }
  }

  await put<Layer>('layers', {
    id: layer.id ?? newId(),
    version: layer.version,
    slug: layer.slug,
    name: layer.name ?? null,
    description: layer.description ?? null,
    definition: layer.definition ?? ({ type: 'custom' } as Layer['definition']),
    index: layer.index,
    locked: layer.locked ?? false,
    created_at: now(),
    updated_at: now(),
  })
  return { ok: true, message: 'Successfully created' }
}

export async function getNextLayerIndex(version: string) {
  const layers = await getAllBy<Layer>('layers', 'version', version)
  if (layers.length === 0) return 0
  return Math.max(...layers.map((l) => l.index)) + 1
}

export async function insertLayerAtTop(layer: UnorderedInsertLayer) {
  const index = await getNextLayerIndex(layer.version)
  return insertLayer({ ...layer, index })
}
