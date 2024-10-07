import type { DataTypeValue, SocketType } from '@/types/database.types'
import type { SocketDefinition } from '@/types/nodes.types'
import { ClassicPreset } from 'rete'
import type { Node } from './node'
import type { Connection } from './connection'
import { isEqual } from 'lodash'
import { validateValueType } from '@/components/datatypes/schemas'
import { toast } from 'sonner'
import type { EnumSettings } from '@repo/engine/src/types/value-types'
export type SocketTypeData = {
  title: string
}

export class Socket extends ClassicPreset.Socket {
  definition: SocketDefinition
  type: SocketType
  list: boolean
  name: string
  value?: DataTypeValue
  connected: boolean
  connection?: Connection
  onConnect: (node: Node, connection: Connection) => void
  onDisconnect: (node: Node, connection: Connection) => void
  constructor(
    public side: 'input' | 'output',
    definition: SocketDefinition,
    private node: Node,
    connection?: Connection,
  ) {
    super('name')
    this.definition = definition
    this.type = definition.type
    this.list = definition.list || false
    this.name = definition.type
    this.connected = !!connection
    this.connection = connection
    this.onConnect = (node: Node, connection: Connection) => {
      this.connected = true
      this.connection = connection
      definition.onConnect?.(node, connection)
      node.context.area.update('node', node.id)
    }
    this.onDisconnect = (node: Node, connection: Connection) => {
      this.connected = false
      this.connection = undefined
      definition.onDisconnect?.(node, connection)
      node.context.area.update('node', node.id)
    }
  }

  setValue(value: DataTypeValue) {
    if (this.type === 'exec' || this.type === 'generic') return
    const { error } = validateValueType<true>(this.type, this.list, value, {
      optional: true,
      asObjectArray: false,
    })
    if (error) {
      throw new Error(
        `Invalid value ${value} for socket ${this.name} of type ${this.type}`,
      )
    }
    this.value = value
  }

  isCompatibleWith(socket: Socket) {
    const isAlreadyConnected = this.node.isConnectedToNode(
      socket.node,
      socket.type === 'exec' ? 'exec' : 'data',
      socket.side,
    )
    if (isAlreadyConnected) {
      toast.warning("Nodes can't be connected in a loop")
      return false
    }
    if (
      (this.list &&
        !socket.list &&
        socket.definition.type === 'generic' &&
        socket.definition.canBeList) ||
      (!this.list &&
        socket.list &&
        this.definition.type === 'generic' &&
        this.definition.canBeList)
    )
      return true

    if ((this.list && !socket.list) || (!this.list && socket.list)) return false

    if (
      (this.type === 'generic' && !this.definition.compatibleWith) ||
      (socket.type === 'generic' && !socket.definition.compatibleWith)
    )
      return true

    if (this.type === 'enum') {
      if (socket.type !== 'enum') return false //if (!["enum", "generic"].includes(socket.type)) return false;
      // TODO: Clean up this mess and test it
      const settings = this.definition.settings as EnumSettings
      const socketSettings = socket.definition as unknown as EnumSettings
      if (!socketSettings) return false

      const socketDef = socket.definition
      if (settings.adaptOptions !== socketSettings.adaptOptions) {
        return true
      }
      const options = settings.options?.map((option) => option.value)
      const socketOptions = socketSettings.options?.map(
        (option) => option.value,
      )
      return isEqual(options, socketOptions)
    }
    if (socket.type === this.type) return true
    if (this.definition.compatibleWith?.includes(socket.type)) return true
    return false
  }
}
