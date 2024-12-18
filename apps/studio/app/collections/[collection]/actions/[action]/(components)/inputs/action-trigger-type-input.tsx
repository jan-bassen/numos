'use client'

import { TabSelect } from '@/components/forms/tab-inputs/tab-select'
import { useAction } from '@/app/collections/[collection]/actions/[action]/action-context'
import { triggerOptionsArray } from '@/lib/constants/triggers'
import type { TriggerType } from '@/types/database.types'
import type { ActionTrigger } from '@/types/actions.types'

const defaultTriggerSettings: Record<TriggerType, ActionTrigger> = {
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
      schedule: '0 0 * * *',
    },
  },
  token: {
    type: 'token',
    settings: {
      event: 'mint',
    },
  },
}

export function ActionTriggerTypeInput() {
  const {
    action: { locked, trigger },
    updateAction,
  } = useAction()
  return (
    <TabSelect
      size="md"
      disabled={locked}
      options={triggerOptionsArray}
      value={trigger?.type}
      onValueChange={async (value: string) => {
        await updateAction({
          trigger: defaultTriggerSettings[value as TriggerType],
        })
      }}
    />
  )
}
