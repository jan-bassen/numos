'use client'

import { useAction } from '@/app/collections/[collection]/actions/[action]/action-context'
import { IntervalSettings } from './interval-settings'
import { ScheduleSettings } from './schedule-settings'
import { TokenSettings } from './token-settings'
import { ApiSettings } from './api-settings'

export function TriggerSettingsSegment() {
  const {
    action: { trigger },
  } = useAction()
  if (!trigger) return null
  switch (trigger.type) {
    case 'api':
      return <ApiSettings />
    case 'interval':
      return <IntervalSettings />
    case 'schedule':
      return <ScheduleSettings />
    case 'token':
      return <TokenSettings />
    default:
      return null
  }
}
