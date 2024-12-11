import type { TriggerType } from '@/types/database.types'
import type { SelectOption } from '@/types/nodes.types'
import {
  PiCalendarFilledStroke,
  PiLinkChainHorizontalStroke,
  PiNftBoltMintStroke,
  PiTimerDefaultStroke,
} from '@repo/ui/icons/pika'

export const tokenEventOptions: SelectOption[] = [
  { value: 'mint', label: 'On Mint' },
  { value: 'transfer', label: 'On Transfer' },
  { value: 'burn', label: 'On Burn' },
  { value: 'approve', label: 'On Approval' },
]

export const intervalUnitOptions: SelectOption[] = [
  { value: 'minutes', label: 'Minutes' },
  { value: 'hours', label: 'Hours' },
  { value: 'days', label: 'Days' },
]

export const triggerOptions: Record<TriggerType, SelectOption> = {
  api: {
    value: 'api',
    label: 'API',
    subtext: 'Call from your app',
    description:
      'Trigger via an API call from your app or website (e.g. on button click)',
    icons: { stroke: PiLinkChainHorizontalStroke },
  },
  interval: {
    value: 'interval',
    label: 'Interval',
    subtext: 'Every X minutes',
    description: 'Trigger automatically at a set interval (e.g. every 3 days)',
    icons: { stroke: PiTimerDefaultStroke },
  },
  schedule: {
    value: 'schedule',
    label: 'Schedule',
    subtext: 'Custom Schedule',
    icons: { stroke: PiCalendarFilledStroke },
    description:
      'Trigger automatically at a schedule (e.g. every first day of the month)',
  },
  token: {
    value: 'token',
    label: 'Token',
    subtext: 'On mint, transfer, ...',
    description:
      'Trigger automatically when a token event occurs (e.g. on transfer)',
    icons: { stroke: PiNftBoltMintStroke },
  },
}

export const triggerOptionsArray = Object.values(triggerOptions)
