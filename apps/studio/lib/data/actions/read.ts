import { FetchError } from '@/lib/errors'
import type { Action } from '@/types/database.types'
import { getCollectionFromSlug } from '@/lib/data/collections'
import { getAllActions } from '@/lib/data/actions'

export {
  getAllActions,
  getLatestActions,
  getActionsForNav,
  getActionBySlug,
  type ActionNavItem,
} from '@/lib/data/actions'

export async function getActionBySlugs(
  collection: string,
  action: string,
): Promise<Action | null> {
  if (!action || !collection) {
    throw new FetchError('No action or collection defined')
  }
  const collectionRow = await getCollectionFromSlug(collection)
  if (!collectionRow.editable_version) return null
  const actions = await getAllActions(collectionRow.editable_version)
  return actions.find((a) => a.slug === action) ?? null
}
