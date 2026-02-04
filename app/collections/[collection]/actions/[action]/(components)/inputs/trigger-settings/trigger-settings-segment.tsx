'use client'

import { useAction } from '@/app/collections/[collection]/actions/[action]/action-context'
import { ApiSettings } from '@/app/collections/[collection]/actions/[action]/(components)/inputs/trigger-settings/api-settings'
import { TokenSettings } from '@/app/collections/[collection]/actions/[action]/(components)/inputs/trigger-settings/token-settings'
import { TimeSettings } from '@/app/collections/[collection]/actions/[action]/(components)/inputs/trigger-settings/time-settings'

export function TriggerSettingsSegment() {
  const {
    action: { trigger },
  } = useAction()
  if (!trigger) return null
  switch (trigger.type) {
    case 'api':
      return <ApiSettings />
    case 'time':
      return <TimeSettings />
    case 'token':
      return <TokenSettings />
    default:
      return null
  }
}
