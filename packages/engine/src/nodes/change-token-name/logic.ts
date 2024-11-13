import type { NodeLogic } from '@repo/engine/types/node-types'
import type { ChangeTokenNameNode } from '@repo/engine/nodes/change-token-name/interface'

export const changeTokenNameLogic: NodeLogic<ChangeTokenNameNode> = {
  execution: async ({ getInputValue, setMetadata }) => {
    const newName = await getInputValue('name')
    const { changed, previous } = await setMetadata('name', newName.value)
    const message = changed
      ? `Token name changed from "${previous.value}" to "${newName.value}"`
      : `Token name unchanged at "${previous.value}"`

    return {
      forward: 'exec',
      log: { message },
    }
  },
}
