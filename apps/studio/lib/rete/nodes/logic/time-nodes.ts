import {
  DataNodeDefinitions,
  type NodeLogicDefinitions,
} from '@/types/nodes.types'
import type { TimeNodeType } from '../definitions/time-nodes'
import { DateTime } from 'luxon'

export const timeNodesLogic: NodeLogicDefinitions<TimeNodeType> = {
  now: {
    simulate: {
      outputs: {
        output: () => {
          return { type: 'datetime', list: false, value: new Date().getTime() }
        },
      },
    },
  },
  'time-difference': {
    simulate: {
      outputs: {
        output: ({ inputs, controls }) => {
          const unit = controls?.unit.value as
            | 'seconds'
            | 'minutes'
            | 'hours'
            | 'days'
            | 'weeks'
            | 'months'
            | 'years'
          const time1 = DateTime.fromMillis(inputs?.time1.value as number)
          const time2 = DateTime.fromMillis(inputs?.time2.value as number)
          const diff = time2.diff(time1, unit)
          switch (unit) {
            case 'seconds':
              return {
                type: 'number',
                list: false,
                value: Math.abs(diff.seconds),
              }
            case 'minutes':
              return {
                type: 'number',
                list: false,
                value: Math.abs(diff.minutes),
              }
            case 'hours':
              return {
                type: 'number',
                list: false,
                value: Math.abs(diff.hours),
              }
            case 'days':
              return { type: 'number', list: false, value: Math.abs(diff.days) }
            case 'weeks':
              return {
                type: 'number',
                list: false,
                value: Math.abs(diff.weeks),
              }
            case 'months':
              return {
                type: 'number',
                list: false,
                value: Math.abs(diff.months),
              }
            case 'years':
              return {
                type: 'number',
                list: false,
                value: Math.abs(diff.years),
              }
            default:
              throw new Error(`Unknown unit ${unit}`)
          }
        },
      },
    },
  },
  'time-information': {
    simulate: {
      outputs: {
        output: ({ inputs, controls }) => {
          const unit = controls?.unit.value as
            | 'second'
            | 'minute'
            | 'hour'
            | 'day'
            | 'day-of-month'
            | 'weeks'
            | 'week'
            | 'month'
            | 'year'
          const time = DateTime.fromMillis(inputs?.time.value as number)
          switch (unit) {
            case 'second':
              return { type: 'number', list: false, value: time.second }
            case 'minute':
              return { type: 'number', list: false, value: time.minute }
            case 'hour':
              return { type: 'number', list: false, value: time.hour }
            case 'day':
              return { type: 'number', list: false, value: time.weekday }
            case 'day-of-month':
              return { type: 'number', list: false, value: time.day }
            case 'week':
              return { type: 'number', list: false, value: time.weekNumber }
            case 'month':
              return { type: 'number', list: false, value: time.month }
            case 'year':
              return { type: 'number', list: false, value: time.year }
            default:
              throw new Error(`Unknown unit ${unit}`)
          }
        },
      },
    },
  },
}
