import type {
  AnyDataSocketDefinition,
  ExecSocketDefinition,
} from '@/types/nodes.types'
import { ClassicPreset } from 'rete'
import type { Node } from '../node'
import type { Connection } from '../connection'
import { isEqual } from 'lodash'
import { toast } from 'sonner'
import type {
  OptionalDataType,
  ValueRestrictions,
  ValueSettings,
} from '@repo/engine/types/value-types'

export class Socket extends ClassicPreset.Socket {
  id: string
  type: OptionalDataType
  list: boolean
  name: string
  connected: boolean
  onConnect: (node: Node, connection: Connection) => void
  onDisconnect: (node: Node, connection: Connection) => void
  constructor(
    public side: 'input' | 'output',
    public definition: AnyDataSocketDefinition | ExecSocketDefinition,
    public node: Node,
    public connection?: Connection,
  ) {
    super('name')
    this.id = crypto.randomUUID()
    this.definition = definition
    this.type = definition.type || 'generic'
    this.name = definition.type || 'generic' //TODO: Remove this
    this.list = definition.type === 'exec' ? false : definition.list || false

    this.connected = !!connection
    this.connection = connection
    this.onConnect = (node: Node, connection: Connection) => {
      this.connected = true
      this.connection = connection
      definition.onConnect?.(node.interactionInterface)
      node.context.area.update('node', node.id)
    }
    this.onDisconnect = (node: Node, connection: Connection) => {
      this.connected = false
      this.connection = undefined
      definition.onDisconnect?.(node.interactionInterface)
      node.context.area.update('node', node.id)
    }
  }

  isCompatibleWith(socket: Socket) {
    if (socket.definition.type === 'exec') {
      if (this.type !== 'exec') return false
      if (this.connected && this.side === 'output') return false
      const isLoop = this.node.isConnectedToNode(
        socket.node,
        'exec',
        socket.side,
      )
      if (isLoop) {
        toast.warning("Nodes can't be connected in a loop")
        return false
      }
      return true
    }
    if (this.definition.type === 'exec') return false

    const isAlreadyConnected = this.node.isConnectedToNode(
      socket.node,
      'data',
      socket.side,
    )
    if (isAlreadyConnected) {
      toast.warning("Nodes can't be connected in a loop")
      return false
    }

    const canSocketBecomeList =
      !socket.list && socket.type === 'generic' && socket.definition.canBeList
    const canThisBecomeList =
      !this.list && this.type === 'generic' && this.definition.canBeList

    if (
      (this.list && canSocketBecomeList) ||
      (socket.list && canThisBecomeList)
    )
      return true

    if ((this.list && !socket.list) || (!this.list && socket.list)) return false

    if (
      (this.type === 'generic' && !this.definition.compatibleWith) ||
      (socket.type === 'generic' && !socket.definition.compatibleWith)
    )
      // TODO: Integrate compatibleWith correctly
      return true

    if (this.type === 'enum') {
      // Compare enum settings
      if (socket.type !== 'enum') return false

      const restrictions = this.definition
        .restrictions as ValueRestrictions<'enum'>
      const socketRestrictions = socket.definition
        .restrictions as ValueRestrictions<'enum'>
      if (!restrictions || !socketRestrictions) return false

      if (restrictions.adaptOptions !== socketRestrictions.adaptOptions) {
        return true
      }
      return isEqual(restrictions.options, socketRestrictions.options)
    }

    if (socket.type === this.type)
      // Compare basic compatibility
      return true
    if (this.definition.compatibleWith?.includes(socket.type)) return true
    return false
  }
}
