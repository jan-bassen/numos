import type { NodeLogic } from '@repo/shared/types/node-types'
import type { TokenAttributeNode } from '@repo/shared/engine/nodes/token-attribute/interface'

export const tokenAttributeLogic: NodeLogic<TokenAttributeNode> = {
  data: {
    attribute: ({ getControlValue, getTokenAttribute }) => {
      const attributeId = getControlValue('attribute')
      return getTokenAttribute(attributeId.value)
    },
  },
}
