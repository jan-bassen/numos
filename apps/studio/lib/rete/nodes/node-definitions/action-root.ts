import type {
  SpecificNodeDefinition,
  DataSocketDefinition,
} from '@/types/nodes.types'
import type { ActionRootNode } from '@repo/engine/nodes/action-root/interface'

export const actionRootDefinition: SpecificNodeDefinition<ActionRootNode> = {
  type: 'action-root',
  category: 'hybrid',
  title: 'Trigger',
  root: true,
  forwards: [{ key: 'exec', label: 'Execute' }],
  componentType: 'generic',
  nodeInfo: {
    description: 'This node starts the execution.',
    link: '#',
  },
  outputs: ({ getTrigger }) => {
    const outputs: DataSocketDefinition<ActionRootNode, 'outputs', string>[] =
      []
    const trigger = getTrigger()
    if (!trigger) return []
    if (trigger.type === 'token') {
      outputs.push({
        key: 'tokenId',
        type: 'number',
        label: 'Token ID',
      })
      if (trigger.settings.event === 'mint') {
        outputs.push({
          key: 'minter',
          type: 'address',
          label: 'Minter',
        })
      } else if (trigger.settings.event === 'burn') {
        outputs.push({
          key: 'burner',
          type: 'address',
          label: 'Burner',
        })
      } else if (trigger.settings.event === 'approve') {
        outputs.push({
          key: 'approved',
          type: 'address',
          label: 'Approved Address',
        })
      }
    }
    if (trigger.type === 'api') {
      outputs.push(
        ...trigger.settings.params.map((param) => {
          return {
            key: param.key,
            type: param.type,
            list: param.list,
            label: param.key,
          }
        }),
      )
    }
    return outputs
  },
}
