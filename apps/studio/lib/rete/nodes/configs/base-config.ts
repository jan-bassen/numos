import {
  PiDatabaseStroke,
  PiFontAaStroke,
  PiGitFork02Stroke,
  PiMathStroke,
  PiNftDefaultStroke,
  PiPencilScaleCrossStroke,
} from '@repo/ui/icons/pika'
import type { EditorContext, Group } from '@/types/nodes.types'

export const baseConfig = (context: EditorContext) => {
  const tokenSubitems =
    context.type === 'action'
      ? [
          'attribute-data',
          'meta-data',
          'separator',
          'change-attribute',
          'change-token-name',
          'change-token-description',
        ]
      : ['attribute-data', 'meta-data']
  const token = {
    label: 'Token',
    key: 'token',
    Icon: PiNftDefaultStroke,
    subitems: tokenSubitems,
  }
  const logic = {
    label: 'Logic',
    key: 'logic',
    Icon: PiGitFork02Stroke,
    subitems: ['logic', 'compare'],
  }
  const math = {
    label: 'Math',
    key: 'math',
    Icon: PiMathStroke,
    subitems: ['maths', 'random', 'round', 'clamp'],
  }
  const text = {
    label: 'Text',
    key: 'text',
    Icon: PiFontAaStroke,
    subitems: ['text-combine', 'truncate', 'replace', 'length'],
  }
  const other = {
    label: 'Other',
    key: 'other',
    Icon: PiDatabaseStroke,
    subitems: [
      {
        key: 'color',
        label: 'Color',
        subitems: ['combine-color', 'split-color'],
      },
      {
        key: 'time',
        label: 'Time',
        subitems: ['now', 'time-difference', 'time-information'],
      },
      {
        key: 'location',
        label: 'Location',
        subitems: ['location-distance'],
      },
    ],
  }
  const utility = {
    label: 'Utility',
    key: 'utility',
    Icon: PiPencilScaleCrossStroke,
    subitems: [
      {
        key: 'conversion',
        label: 'Conversion',
        subitems: [
          'data-switch',
          'map-to-number',
          'map-to-date',
          'map-to-choice',
        ],
      },
      {
        key: 'constants',
        label: 'Constants',
        subitems: [
          'enum-input',
          'text-input',
          'number-input',
          'boolean-input',
          'address-input',
          'color-input',
          'datetime-input',
          'location-input',
          'weather-input',
          'direction-input',
        ],
      },
      {
        label: 'Lists',
        key: 'list',
        subitems: ['list-append', 'list-prepend', 'list-length', 'is-in-list'],
      },
    ],
  }
  return [token, logic, math, text, other, utility] as Group[]
}
