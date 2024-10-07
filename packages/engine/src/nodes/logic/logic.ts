import type { NodeLogic } from '@repo/engine/types/node-types.ts'
import type { LogicNode } from './interface.ts'
import { NodeError } from '@repo/engine/errors/node-error.ts'

export const logicLogic: NodeLogic<LogicNode> = {
  data: {
    output: ({ getInputValue, getControlValue }) => {
      const boolean1 = getInputValue('boolean1')
      const boolean2 = getInputValue('boolean2')
      const mode = getControlValue('mode').value
      switch (mode) {
        case 'and':
          return {
            type: 'boolean',
            format: 'single',
            value: boolean1.value && boolean2.value,
          }
        case 'or':
          return {
            type: 'boolean',
            format: 'single',
            value: boolean1.value || boolean2.value,
          }
        case 'not':
          return {
            type: 'boolean',
            format: 'single',
            value: !boolean1.value,
          }
        case 'xor':
          return {
            type: 'boolean',
            format: 'single',
            value: boolean1.value !== boolean2.value,
          }
        case 'nand':
          return {
            type: 'boolean',
            format: 'single',
            value: !(boolean1.value && boolean2.value),
          }
        default:
          throw new NodeError('Invalid mode', {
            component: {
              key: 'mode',
              type: 'control',
            },
          })
      }
    },
  },
}
