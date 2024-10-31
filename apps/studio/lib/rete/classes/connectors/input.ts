import type {
  AnyControlDefinition,
  AnyDataSocketDefinition,
} from '@/types/nodes.types'
import { Control } from '../control'
import type { Node } from '../node'
import type { Connection } from '../connection'
import { Socket } from './socket'
import type { Value, ValueType } from '@repo/engine/types/value-types'
import { resolveObjectArrayValue } from '@repo/engine/datatypes/utils'

export class Input {
  id: string
  label: string
  socket: Socket
  control: Control | null = null
  showControl = true

  constructor(
    public node: Node,
    public definition: AnyDataSocketDefinition<'inputs'>, //TODO: Add exec input definition
    value?: Value<ValueType, 'single' | 'objectarray', true>,
    connection?: Connection,
  ) {
    this.id = crypto.randomUUID()
    this.label = definition.label
    this.socket = new Socket('input', definition, node, connection)
    if (definition.type) {
      const impliedControl: AnyControlDefinition = {
        type: definition.type,
        list: definition.list || false,
        key: definition.key,
        settings: definition.settings,
      }
      this.control = new Control(
        node,
        definition.control || impliedControl,
        value,
      )
      if (definition.hideControl) this.showControl = false
    }
  }

  getControlValue():
    | Value<ValueType, 'single' | 'objectarray', true>
    | undefined {
    return this.control?.value
  }

  getResolvedControlValue():
    | Value<ValueType, 'single' | 'array', true>
    | undefined {
    const unresolvedValue = this.control?.getValue()
    if (!unresolvedValue) return
    const resolvedValue = resolveObjectArrayValue(unresolvedValue)
    return resolvedValue
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
