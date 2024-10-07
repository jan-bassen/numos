import type { NodeLogic } from '@repo/engine/types/node-types.ts'
import type { TokenAttributeNode } from './interface.ts'

export const tokenAttributeLogic: NodeLogic<TokenAttributeNode> = {
  data: {
    attribute: ({ getControlValue, getTokenAttribute }) => {
      const attributeKey = getControlValue('attribute')
      return getTokenAttribute(attributeKey.value)
    },
  },
}
