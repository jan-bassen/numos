import type { NodeLogic } from '@repo/engine/types/node-types'
import type { ChangeTokenDescriptionNode } from '@repo/engine/nodes/change-token-description/interface'

export const changeTokenDescriptionLogic: NodeLogic<ChangeTokenDescriptionNode> =
  {
    execution: async ({ getInputValue, setMetadata }) => {
      const newName = await getInputValue('description')
      const { changed, previous } = await setMetadata(
        'description',
        newName.value,
      )
      const message = changed
        ? `Token description changed from ${previous} to ${newName.value}`
        : `Token description unchanged at ${previous}`

      return {
        forward: 'exec',
        log: { message },
      }
    },
  }
