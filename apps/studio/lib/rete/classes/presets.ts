import { type NodeBase, getUID } from 'rete'
import type { Input } from './input'
import type { Controls, Inputs, Outputs } from '@/types/nodes.types'
import type { Control } from './control'
import type { Output } from './output'

export class NodePreset implements NodeBase {
  id: NodeBase['id']
  inputs: Inputs = {} as Inputs
  outputs: Outputs = {} as Outputs
  controls: Controls = {} as Controls
  selected?: boolean

  constructor(public label: string) {
    this.id = getUID()
  }

  hasInput(key: string) {
    return Object.prototype.hasOwnProperty.call(this.inputs, key)
  }

  addInput(key: string, input: Input) {
    if (this.hasInput(key))
      throw new Error(`input with key '${String(key)}' already added`)

    Object.defineProperty(this.inputs, key, {
      value: input,
      enumerable: true,
      configurable: true,
    })
  }

  removeInput(key: string) {
    delete this.inputs[key]
  }

  hasOutput(key: string) {
    return Object.prototype.hasOwnProperty.call(this.outputs, key)
  }

  addOutput(key: string, output: Output) {
    if (this.hasOutput(key))
      throw new Error(`output with key '${String(key)}' already added`)

    Object.defineProperty(this.outputs, key, {
      value: output,
      enumerable: true,
      configurable: true,
    })
  }

  removeOutput(key: string) {
    delete this.outputs[key]
  }

  hasControl(key: string) {
    return Object.prototype.hasOwnProperty.call(this.controls, key)
  }

  addControl(key: string, control: Control) {
    if (this.hasControl(key))
      throw new Error(`control with key '${String(key)}' already added`)

    Object.defineProperty(this.controls, key, {
      value: control,
      enumerable: true,
      configurable: true,
    })
  }

  removeControl(key: string) {
    delete this.controls[key]
  }
}
