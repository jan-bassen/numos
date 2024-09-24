import type { SavedOutput, SocketDefinition } from '@/types/nodes.types'
import { Port } from './port'
import type { Connection } from './connection'
import type { Node } from './node'

export class Output extends Port {
  constructor(
    node: Node,
    definition: SocketDefinition,
    savedOutput?: SavedOutput,
    connection?: Connection,
  ) {
    super('output', definition, node, savedOutput?.id, connection)
    this.multipleConnections = definition.multipleConnections || true
  }
  serialize(): SavedOutput {
    return {
      id: this.id,
      key: this.definition.key,
      type: this.socket.type,
      list: this.socket.list,
    }
  }
}
