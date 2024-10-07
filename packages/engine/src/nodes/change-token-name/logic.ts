import type { NodeLogic } from '@repo/engine/types/node-types.ts'
import type { ChangeTokenNameNode } from './interface.ts'

export const changeTokenNameLogic: NodeLogic<ChangeTokenNameNode> = {
  execution: async ({ getInputValue, setMetadata }) => {
    const newName = getInputValue('name')
    const { changed, previous } = setMetadata('name', newName.value)
    const message = changed
      ? `Token name changed from ${previous} to ${newName.value}`
      : `Token name unchanged at ${previous}`

    return {
      forward: 'exec',
      log: { message },
    }
  },
}
