import type {
  FullValue,
  Value,
  ValueType,
} from '@repo/engine/types/value-types'
import type { IntervalUnit } from './database.types'
import type { CronObject } from '@/app/collections/[collection]/actions/[action]/(components)/cron-input'

export type TokenEvent = 'mint' | 'transfer' | 'burn' | 'approve'

export type Parameter = {
  id: string
  key: string
  value: FullValue
}

export type ActionTrigger =
  | {
      type: 'api'
      settings: {
        params: Parameter[]
      }
    }
  | {
      type: 'interval'
      settings: {
        start?: number
        end?: number
        interval: number
        unit: IntervalUnit
      }
    }
  | {
      type: 'schedule'
      settings: {
        start?: number
        end?: number
        schedule: CronObject
      }
    }
  | {
      type: 'token'
      settings: {
        event: TokenEvent
      }
    }

export type ParameterInfo = { key: string; value: FullValue }
export type ParameterState = Record<
  string,
  Value<ValueType, 'objectarray' | 'single'>
>
