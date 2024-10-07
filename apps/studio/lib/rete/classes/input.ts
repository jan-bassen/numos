import type {
  ControlDefinition,
  SavedInput,
  SocketDefinition,
} from '@/types/nodes.types'
import { Control } from './control'
import { Port } from './port'
import type { Node } from './node'
import type { Connection } from './connection'

export class Input extends Port {
  control: Control | null = null
  showControl = true

  constructor(
    public node: Node,
    definition: SocketDefinition,
    savedInput?: SavedInput,
    connection?: Connection,
  ) {
    super('input', definition, node, savedInput?.id, connection)
    this.multipleConnections =
      definition.type === 'exec'
        ? true
        : definition.multipleConnections || false
    if (
      !definition.hideControl &&
      definition.type !== 'exec' &&
      definition.type !== 'image' &&
      !definition.list
    ) {
      let impliedControl: ControlDefinition
      if (definition.type === 'enum') {
        const settings = definition.settings
        const options =
          settings && 'options' in settings ? settings.options : []
        impliedControl = {
          key: definition.key,
          type: 'enum',
          options,
        }
      } else {
        impliedControl = {
          key: definition.key,
          type: definition.type,
        }
      }
      this.addControl(
        new Control(
          node,
          definition.control || impliedControl,
          savedInput && 'control' in savedInput
            ? savedInput?.control
            : undefined,
        ),
      )
    }
  }

  serialize(): SavedInput {
    return {
      id: this.id,
      key: this.definition.key,
      type: this.socket.type,
      list: this.socket.list,
      control: this.control?.serialize(),
    }
  }

  addControl(control: Control, showControl = true) {
    if (this.control) throw new Error('control already added for this input')
    this.control = control
    this.showControl = showControl
  }

  removeControl() {
    this.control = null
  }
}
