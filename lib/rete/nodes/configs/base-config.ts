import {
  PiDatabaseStroke,
  PiFontAaStroke,
  PiGitFork02Stroke,
  PiMathStroke,
  PiNftDefaultStroke,
  PiPencilScaleCrossStroke,
} from '@repo/ui/icons/pika'
import type { EditorContext, Group } from '@/types/editor.types'

function getTokenSubitems(context: EditorContext) {
  const hasAttribute = context.attributes.length > 0

  const tokenSubitems: string[] = []
  if (hasAttribute) {
    tokenSubitems.push('token-attribute')
  }
  tokenSubitems.push('metadata')
  if (context.type === 'action') {
    tokenSubitems.push('separator')
    if (hasAttribute) {
      tokenSubitems.push('change-token-attribute')
    }
    tokenSubitems.push('change-token-name')
    tokenSubitems.push('change-token-description')
  }

  return tokenSubitems
}

export const baseConfig = (context: EditorContext) => {
  const token = {
    label: 'Token',
    key: 'token',
    Icon: PiNftDefaultStroke,
    subitems: getTokenSubitems(context),
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
        subitems: ['data-switch', 'map-to-number', 'map-to-date'],
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
        subitems: ['list-add', 'list-length', 'is-in-list'],
      },
    ],
  }
  return [token, logic, math, text, other, utility] as Group[]
}
