import type { NodeLogic } from '@repo/engine/types/node-types'
import type { LogicNode } from '@repo/engine/nodes/logic/interface'
import { NodeError } from '@repo/engine/errors/node-error'

export const logicLogic: NodeLogic<LogicNode> = {
  data: {
    output: async ({ getInputValue, getControlValue }) => {
      const boolean1 = await getInputValue('boolean1')
      const boolean2 = await getInputValue('boolean2')
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
