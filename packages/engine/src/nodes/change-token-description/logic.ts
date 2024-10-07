import type { NodeLogic } from '@repo/engine/types/node-types.ts'
import type { ChangeTokenDescriptionNode } from './interface.ts'

export const changeTokenDescriptionLogic: NodeLogic<ChangeTokenDescriptionNode> =
  {
    execution: async ({ getInputValue, setMetadata }) => {
      const newName = getInputValue('description')
      const { changed, previous } = setMetadata('description', newName.value)
      const message = changed
        ? `Token description changed from ${previous} to ${newName.value}`
        : `Token description unchanged at ${previous}`

      return {
        forward: 'exec',
        log: { message },
      }
    },
  }
