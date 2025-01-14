import type { ActionTrigger } from '@/lib/schemas/actions/action-schema'
import type { TriggerType } from '@/types/database.types'

export const defaultTriggerSettings: Record<TriggerType, ActionTrigger> = {
  api: {
    type: 'api',
    settings: {
      params: [],
    },
  },
  interval: {
    type: 'interval',
    settings: {
      interval: 7,
      unit: 'days',
    },
  },
  schedule: {
    type: 'schedule',
    settings: {
      schedule: {
        schedule: '0 10 1 * ? *',
        description: 'Every first day of the month at 10am',
      },
    },
  },
  token: {
    type: 'token',
    settings: {
      event: 'mint',
    },
  },
}
