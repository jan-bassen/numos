import type { ImportingState } from '@/server/sync/sync-account'
import 'server-only'

const tasks = new Map<string, ImportingState>()

export const getTask = (userId: string) => tasks.get(userId)

export const createOrGetTask = (userId: string): ImportingState => {
  if (!tasks.has(userId)) {
    tasks.set(userId, {
      progress: 0,
      completed: null,
      wallets: {},
    })
  }
  return tasks.get(userId) as ImportingState
}

export const updateTask = (userId: string, data: Partial<ImportingState>) => {
  const task = tasks.get(userId)
  if (task) {
    tasks.set(userId, { ...task, ...data } as ImportingState)
  }
}
