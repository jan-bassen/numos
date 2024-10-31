import type {
  Area,
  Group,
  Item,
  ResolvedEditorConfig,
} from '@/types/editor.types'
import type { NodeEditor } from '../classes/editor'
import type { NodeType } from '@repo/engine/types/node-types'

export type NewNodePosition = 'center' | 'pointer'

export function getNodeMenuList(
  addNewNode: (type: NodeType, position: NewNodePosition) => Promise<void>,
  editor: NodeEditor,
  area: Area,
  config: ResolvedEditorConfig,
) {
  const list: Item[] = config.groups.map((group) => {
    return {
      label: group.label,
      Icon: group.Icon,
      key: group.key,
      handler: (mode: NewNodePosition) => null,
      subitems: resolveSubitems(
        group.subitems,
        addNewNode,
        editor,
        area,
        config,
      ),
    }
  })
  return list
}

function resolveSubitems(
  subitems: Array<NodeType | 'separator' | Group<NodeType>>,
  addNewNode: (type: NodeType, position: NewNodePosition) => Promise<void>,
  editor: NodeEditor,
  area: Area,
  config: ResolvedEditorConfig,
): Item[] | undefined {
  if (subitems.length === 0) return undefined
  return subitems
    .filter((item) => {
      if (typeof item === 'string') {
        if (item === 'separator') return true
        const nodeCategory = config.nodes[item].category
        if (
          config.type === 'data' &&
          (nodeCategory === 'exec' || nodeCategory === 'hybrid')
        ) {
          return false
        }
        return !config.blocklist.includes(item)
      }
      return item.subitems?.length > 0
    })
    .map((subitem, index) => {
      if (typeof subitem === 'string' && subitem !== 'separator') {
        const node = config.nodes[subitem]
        return {
          label: node?.title ?? subitem,
          Icon: undefined,
          key: subitem,
          subitems: undefined,
          handler: async (position: NewNodePosition) =>
            await addNewNode(subitem, position),
        }
      }
      if (subitem === 'separator') {
        return {
          label: 'Separator',
          Icon: undefined,
          key: 'separator',
          subitems: undefined,
          handler: () => null,
        }
      }
      return {
        label: subitem.label,
        Icon: subitem.Icon,
        key: subitem.label,
        handler: (position: NewNodePosition) => null,
        subitems: resolveSubitems(
          subitem.subitems,
          addNewNode,
          editor,
          area,
          config,
        ),
      }
    })
}
