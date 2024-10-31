import type { NodeLogic } from '@repo/engine/types/node-types'
import type { TokenAttributeNode } from '@repo/engine/nodes/token-attribute/interface'

export const tokenAttributeLogic: NodeLogic<TokenAttributeNode> = {
  data: {
    attribute: ({ getControlValue, getTokenAttribute }) => {
      const attributeKey = getControlValue('attribute')
      return getTokenAttribute(attributeKey.value)
    },
  },
}
