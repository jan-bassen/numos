import type {
  FullValue,
  Value,
  ValueType,
} from '@repo/engine/types/value-types'
import type { IntervalUnit } from './database.types'

export type TokenEvent = 'mint' | 'transfer' | 'burn' | 'approve'

export type ActionTrigger =
  | {
      type: 'api'
      settings: {
        params: {
          key: string
          value: FullValue
        }[]
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
        schedule: string
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
