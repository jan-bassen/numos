import { type NodeBase, getUID } from 'rete'
import type { Controls, Inputs, Outputs } from '@/types/nodes.types'
import type { Control } from './control'
import type { Output } from './connectors/output'
import type { Input } from './connectors/input'

//TODO: Add sorting to elements
// TODO: Clean up methods ->  only one socket type
export class NodePreset implements NodeBase {
  id: NodeBase['id']
  inputs: Inputs = {} as Inputs
  outputs: Outputs = {} as Outputs
  controls: Controls = {} as Controls

  constructor(public label: string) {
    this.id = getUID()
  }

  // ----- Inputs -----

  hasInput(key: string): boolean {
    return Object.prototype.hasOwnProperty.call(this.inputs, key)
  }

  addInput(key: string, input: Input) {
    if (key === 'exec') throw new Error('exec input cant be of type data')

    if (this.hasInput(key))
      throw new Error(`input with key '${String(key)}' already added`)

    Object.defineProperty(this.inputs, key, {
      value: input,
      enumerable: true,
      configurable: true,
    })
  }

  removeInput(key: string) {
    if (key === 'exec') throw new Error('exec input cant be of type data')
    delete this.inputs[key]
  }

  getInput(key: string) {
    if (key === 'exec') throw new Error('exec input cant be of type data')
    return this.inputs[key]
  }

  getInputs() {
    return this.inputs
  }

  getDataInputs() {
    return Object.values(this.inputs).filter(
      (input) => input.socket.type !== 'exec',
    )
  }

  getExecInput() {
    return Object.values(this.inputs).filter(
      (input) => input.socket.type === 'exec',
    )[0]
  }

  getInputEntries() {
    return Object.entries(this.inputs)
  }

  getDataInputEntries() {
    return Object.entries(this.inputs).filter(
      (input) => input[1].socket.type !== 'exec',
    )
  }

  getInputKeys() {
    return Object.keys(this.inputs)
  }

  // ----- Outputs -----

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

  getOutput(key: string) {
    return this.outputs[key]
  }

  getOutputs() {
    return this.outputs
  }

  getDataOutputs() {
    return Object.values(this.outputs).filter(
      (output) => output.socket.type !== 'exec',
    )
  }

  getExecOutputs() {
    return Object.values(this.outputs).filter(
      (output) => output.socket.type === 'exec',
    )
  }

  getOutputEntries() {
    return Object.entries(this.outputs)
  }

  getExecOutputEntries() {
    return Object.entries(this.outputs).filter(
      (output) => output[1].socket.type === 'exec',
    )
  }

  getOutputKeys() {
    return Object.keys(this.outputs)
  }

  // ----- Controls -----

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

  getControl(key: string) {
    return this.controls[key]
  }

  getControls() {
    return this.controls
  }

  getControlEntries() {
    return Object.entries(this.controls)
  }

  getControlKeys() {
    return Object.keys(this.controls)
  }
}
