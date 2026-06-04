import { FetchError } from '@/lib/errors'
import { getCollectionFromSlug } from './collections'
import type {
  Action,
  InsertAction,
  ReturnInfo,
  TriggerType,
  UpdateAction,
} from '@/types/database.types'
import { redirect } from 'next/navigation'
import type { ActionTrigger } from '@/lib/schemas/actions/action-schema'
import { getAllBy, newId, patch, put, remove } from './store'

const regex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const now = () => new Date().toISOString()

export async function getAllActions(version: string): Promise<Action[]> {
  if (!version) {
    throw new FetchError('No collection defined')
  }
  const actions = await getAllBy<Action>('actions', 'version', version)
  return actions.sort((a, b) => (a.name ?? '').localeCompare(b.name ?? ''))
}

export async function getLatestActions(
  version: string,
  amount = 3,
): Promise<Action[]> {
  if (!version) {
    throw new FetchError('No collection defined')
  }
  const actions = await getAllBy<Action>('actions', 'version', version)
  return actions
    .sort((a, b) => (b.updated_at ?? '').localeCompare(a.updated_at ?? ''))
    .slice(0, amount)
}

export async function getAllActionsBySlug(
  collectionSlug: string,
): Promise<Action[]> {
  if (!collectionSlug) {
    throw new FetchError('No collection defined')
  }
  const collection = await getCollectionFromSlug(collectionSlug)
  if (!collection.editable_version) {
    throw new FetchError('No editable version found')
  }
  return getAllActions(collection.editable_version)
}

export type ActionNavItem = {
  slug: string
  name: string | null
  type: TriggerType | null
}

export async function getActionsForNav(
  collectionSlug: string,
): Promise<ActionNavItem[]> {
  if (!collectionSlug) {
    throw new FetchError('No collection defined')
  }
  const collection = await getCollectionFromSlug(collectionSlug)
  if (!collection.editable_version) {
    throw new FetchError('No editable version found')
  }
  const actions = await getAllActions(collection.editable_version)
  return actions
    .map((action) => ({
      slug: action.slug,
      name: action.name,
      type: action.trigger?.type ?? null,
    }))
    .sort((a, b) => {
      const byType = (a.type ?? '').localeCompare(b.type ?? '')
      if (byType !== 0) return byType
      return (a.name ?? '').localeCompare(b.name ?? '')
    })
}

export async function getActionBySlug(
  slug: string,
  version: string,
): Promise<Action> {
  if (!slug) {
    throw new FetchError('No action defined')
  }
  const actions = await getAllBy<Action>('actions', 'version', version)
  const matches = actions.filter((a) => a.slug === slug)
  if (matches.length > 1) {
    throw new FetchError('Multiple actions found')
  }
  const action = matches[0]
  if (!action) throw new FetchError('Action not found')
  return action
}

function buildAction(action: InsertAction): Action {
  return {
    id: action.id ?? newId(),
    version: action.version,
    slug: action.slug,
    name: action.name ?? null,
    description: action.description ?? null,
    trigger: action.trigger ?? null,
    locked: action.locked ?? false,
    created_at: now(),
    updated_at: now(),
  }
}

async function upsertWithSlugCheck(
  action: InsertAction,
): Promise<ReturnInfo> {
  const allSlugs = await getAllBy<Action>('actions', 'version', action.version)
  if (
    allSlugs.some((act) => act.slug === action.slug && act.id !== action.id)
  ) {
    return { ok: false, message: 'Too similar name already in use' }
  }

  if (action.id) {
    const updated = await patch<Action>('actions', action.id, {
      ...action,
      updated_at: now(),
    })
    if (updated) {
      return { ok: true, message: 'Successfully created new action!' }
    }
  }
  await put('actions', buildAction(action))
  return { ok: true, message: 'Successfully created new action!' }
}

export async function upsertBasicAction(
  action: InsertAction,
): Promise<ReturnInfo> {
  if (!action.slug) {
    return { ok: false, message: 'No slug defined' }
  }
  if (!regex.test(action.slug)) {
    return {
      ok: false,
      message: 'Slug can only contain lowercase letters, numbers, and dashes',
    }
  }
  return upsertWithSlugCheck(action)
}

export async function insertAction(action: InsertAction): Promise<ReturnInfo> {
  if (!action.slug) {
    return { ok: false, message: 'No slug defined' }
  }
  if (action.slug === 'new') {
    return { ok: false, message: "Slug cannot be 'new'" }
  }
  if (!regex.test(action.slug)) {
    return {
      ok: false,
      message: 'Slug can only contain lowercase letters, numbers, and dashes',
    }
  }
  return upsertWithSlugCheck(action)
}

export async function updateActionSettings(
  id: string,
  trigger: ActionTrigger,
): Promise<ReturnInfo> {
  if (!id) {
    return { ok: false, message: 'No action ID provided' }
  }
  const updated = await patch<Action>('actions', id, { trigger })
  if (!updated) {
    return { ok: false, message: 'Action not found' }
  }
  return { ok: true, message: 'Successfully saved' }
}

export async function editAction(action: UpdateAction) {
  if (!action.id) {
    return { ok: false, message: 'No action ID provided' }
  }
  const updated = await patch<Action>('actions', action.id, action)
  if (!updated) {
    return { ok: false, message: 'Action not found' }
  }
  return { ok: true, message: 'Successfully updated' }
}

export async function setActionLock(id: string, locked: boolean) {
  const updated = await patch<Action>('actions', id, { locked })
  if (!updated) {
    throw new FetchError('Error with updating action')
  }
}

export async function deleteAction(id: string, collectionSlug: string) {
  if (!id) {
    throw new FetchError('No action defined')
  }
  await remove('actions', id)
  redirect(`/collections/${collectionSlug}/actions`)
}

export async function deleteActionBySlug(
  versionId: string,
  actionSlug: string,
) {
  const actions = await getAllBy<Action>('actions', 'version', versionId)
  const action = actions.find((a) => a.slug === actionSlug)
  if (!action) {
    return { ok: false, message: 'Unknown action' }
  }
  await remove('actions', action.id)
  return { ok: true, message: 'Successfully deleted' }
}
