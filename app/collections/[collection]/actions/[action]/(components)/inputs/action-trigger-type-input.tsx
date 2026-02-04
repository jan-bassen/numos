'use client'

import { TabSelect } from '@/components/forms/tab-inputs/tab-select'
import { useAction } from '@/app/collections/[collection]/actions/[action]/action-context'
import { triggerOptionsArray } from '@/lib/constants/triggers'
import type { TriggerType } from '@/types/database.types'
import { defaultTriggerSettings } from '@/lib/defaults/actions/trigger-settings'

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
