import { getUID } from 'rete'
import { Socket } from './socket'
import type { SocketDefinition } from '@/types/nodes.types'
import type { Connection } from './connection'
import type { Node } from './node'

export class Port {
  id: string
  socket: Socket
  label?: string
  multipleConnections?: boolean
  index?: number
  constructor(
    public side: 'input' | 'output',
    public definition: SocketDefinition,
    public node: Node,
    id?: string,
    connection?: Connection,
  ) {
    this.id = id || getUID()
    this.index = definition.index
    this.socket = new Socket(side, definition, node, connection)
    this.label = definition.label
    this.multipleConnections = definition.multipleConnections
  }
}
