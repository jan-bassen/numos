import type { TabOption } from '@/components/forms/tab-inputs/tab-option'
import type { TriggerType } from '@/types/database.types'
import type { SelectOption } from '@/types/nodes.types'
import {
  PiCalendarFilledStroke,
  PiLinkChainHorizontalStroke,
  PiNftArrowRightStroke,
  PiNftBoltMintStroke,
  PiNftRemoveStroke,
  PiTimerDefaultStroke,
} from '@repo/ui/icons/pika'
import type { TokenEvent } from '@/lib/schemas/actions/triggers/token'

export const tokenEventOptions: Omit<
  Record<TokenEvent, TabOption>,
  'approve'
> = {
  mint: {
    value: 'mint',
    label: 'On Mint',
    Icon: PiNftBoltMintStroke,
    subtext: 'New token created',
  },
  transfer: {
    value: 'transfer',
    label: 'On Transfer',
    Icon: PiNftArrowRightStroke,
    subtext: 'Token changes wallet',
  },
  burn: {
    value: 'burn',
    label: 'On Burn',
    Icon: PiNftRemoveStroke,
    subtext: 'Token destroyed',
  },
}

export const tokenEventOptionsArray = Object.values(tokenEventOptions)

export const intervalUnitOptions: SelectOption[] = [
  { value: 'minutes', label: 'Minutes' },
  { value: 'hours', label: 'Hours' },
  { value: 'days', label: 'Days' },
]

export const triggerOptions: Record<TriggerType, TabOption> = {
  api: {
    value: 'api',
    label: 'API',
    subtext: 'Call from your app',
    description:
      'Trigger via an API call from your app or website (e.g. on button click)',
    Icon: PiLinkChainHorizontalStroke,
  },
  interval: {
    value: 'interval',
    label: 'Interval',
    subtext: 'Every X minutes',
    description: 'Trigger automatically at a set interval (e.g. every 3 days)',
    Icon: PiTimerDefaultStroke,
  },
  schedule: {
    value: 'schedule',
    label: 'Schedule',
    subtext: 'Custom Schedule',
    Icon: PiCalendarFilledStroke,
    description:
      'Trigger automatically at a schedule (e.g. every first day of the month)',
  },
  token: {
    value: 'token',
    label: 'Token',
    subtext: 'On mint, transfer, ...',
    description:
      'Trigger automatically when a token event occurs (e.g. on transfer)',
    Icon: PiNftBoltMintStroke,
  },
}

export const triggerOptionsArray = Object.values(triggerOptions)
