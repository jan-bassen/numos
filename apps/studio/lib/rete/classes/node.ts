import type { GraphErrorData } from '@/lib/errors'
import {
  type ControlDefinition,
  type DynamicControlsDefinition,
  type EnumSocketDefinition,
  type NodeContext,
  type NodeDefinition,
  type SavedControl,
  type SavedControlMap,
  type SavedInput,
  type SavedInputMap,
  type SavedMapNode,
  type SavedNode,
  type SavedOutput,
  type SavedOutputMap,
  type SocketDefinition,
  isExecInput,
  isExecOutput,
  type DynamicInputsDefinition,
  type DynamicOutputsDefinition,
  type Position,
} from '@/types/nodes.types'
import { Control } from './control'
import { NodePreset } from './presets'
import type {
  DataTypeValue,
  NotatedDataTypeValue,
} from '@/types/database.types'
import { debounce, isEqual } from 'lodash'
import { Input } from './input'
import { Output } from './output'

export class Node extends NodePreset {
  width?: number
  height?: number
  error?: GraphErrorData
  comment?: string
  constructor(
    public definition: NodeDefinition,
    public context: NodeContext,
    savedNode?: SavedNode,
    public initialPosition?: Position,
  ) {
    super(definition.title)
    this.definition = definition
    this.id = savedNode?.id || crypto.randomUUID()
    this.context = context
    if (!initialPosition && savedNode?.x && savedNode?.y) {
      this.initialPosition = { x: savedNode.x, y: savedNode.y }
    }
    this.initialize(definition, savedNode)
  }

  initialize = (definition: NodeDefinition, savedNode?: SavedNode) => {
    this.comment = savedNode?.comment
    definition.controls &&
      this.initControls(definition.controls, savedNode?.controls)
    definition.inputs && this.initInputs(definition.inputs, savedNode?.inputs)
    definition.outputs &&
      this.initOutputs(definition.outputs, savedNode?.outputs)
    this.context.area.update('node', this.id)
  }

  initControls = (
    definition: DynamicControlsDefinition,
    savedControls?: SavedControlMap,
  ) => {
    const staticControls = this.resolveControlsDefinition(
      definition,
      savedControls,
    )
    for (const control of staticControls) {
      this.addControl(
        control.key,
        new Control(this, control, savedControls?.[control.key]),
      )
    }
  }

  getControl = (key: string) => {
    const control = this.controls[key]
    if (!control) throw new Error(`Control ${key} not found`)
    return control
  }

  getConnectedInputs = () => {
    return this.context.editor
      .getConnections()
      .map((connection) => {
        if (connection.target === this.id) {
          return { key: connection.targetInput, connectionId: connection.id }
        }
      })
      .filter((input) => input !== undefined)
  }

  getConnectedOutputs = () => {
    return this.context.editor.getConnections().map((connection) => {
      if (connection.source === this.id) {
        return connection.sourceOutput
      }
    })
  }

  resolveInputsDefinition = (
    definition: DynamicInputsDefinition,
    savedInputs?: SavedInputMap,
  ): SocketDefinition[] => {
    if (Array.isArray(definition)) return definition
    return definition(this, savedInputs)
  }

  resolveOutputsDefinition = (
    definition: DynamicOutputsDefinition,
    savedOutputs?: SavedOutputMap,
  ): SocketDefinition[] => {
    if (Array.isArray(definition)) return definition
    return definition(this, savedOutputs)
  }

  resolveControlsDefinition = (
    definition: DynamicControlsDefinition,
    savedControls?: SavedControlMap,
  ): ControlDefinition[] => {
    if (Array.isArray(definition)) return definition
    return definition(this, savedControls)
  }

  initInputs = (
    definition: DynamicInputsDefinition,
    savedInputs?: SavedInputMap,
  ) => {
    const staticInputs = this.resolveInputsDefinition(definition, savedInputs)
    if (this.definition.type === 'compare') {
      console.log(staticInputs)
      console.log(savedInputs)
    }
    for (const input of staticInputs) {
      this.addInput(
        input.key,
        new Input(
          this,
          input,
          savedInputs?.[input.key] as SavedInput | undefined,
        ),
      )
    }
  }

  initOutputs = (
    definition: DynamicOutputsDefinition,
    savedOutputs?: SavedOutputMap,
  ) => {
    const staticOutputs = this.resolveOutputsDefinition(
      definition,
      savedOutputs,
    )
    for (const output of staticOutputs) {
      this.addOutput(
        output.key,
        new Output(
          this,
          output,
          savedOutputs?.[output.key] as SavedOutput | undefined,
        ),
      )
    }
  }

  updateControls = () => {
    if (!this.definition.controls) return
    const oldControls = this.controls
    const staticControls = Array.isArray(this.definition.controls)
      ? this.definition.controls
      : this.definition.controls(this)

    const oldControlKeys = Object.keys(this.controls)
    for (const oldControlKey of oldControlKeys) {
      if (!staticControls.some((socket) => socket.key === oldControlKey)) {
        this.removeControl(oldControlKey)
      }
    }
    for (const control of staticControls) {
      if (!this.hasControl(control.key)) {
        this.addControl(control.key, new Control(this, control, undefined))
      } else {
        const oldControl = oldControls[control.key]
        const oldSavedControl = oldControl?.serialize()
        if (
          oldControl &&
          (oldControl.value.type === control.type || control.type === 'generic')
        ) {
          if (control.type === 'enum') {
            const def = control as EnumSocketDefinition
            this.removeControl(control.key)
            this.addControl(
              control.key,
              new Control(this, control, oldSavedControl),
            )
            def.options.map((option) => {
              if (oldControl.value.value === option.value) {
                const newControl = this.getControl(control.key)
                newControl.setValue(option.value)
              }
            })
          } else {
            const newControl = this.getControl(control.key)
            newControl.setNotatedValue(oldControl.value)
          }
        }
        if (
          oldControl &&
          oldControl.value.type !== control.type &&
          control.type !== 'generic'
        ) {
          this.removeControl(control.key)
          this.addControl(control.key, new Control(this, control, undefined))
        }
      }
    }
    this.context.area.update('node', this.id)
  }

  updateControl = (controlKey: string, value?: DataTypeValue | null) => {
    if (!this.definition.controls) return
    if (this.hasControl(controlKey)) {
      const staticControls = Array.isArray(this.definition.controls)
        ? this.definition.controls
        : this.definition.controls(this)
      const newControlDef = staticControls.find(
        (control) => control.key === controlKey,
      )
      if (!newControlDef) return
      const oldSavedControl = this.controls[controlKey]?.serialize()
      this.removeControl(controlKey)
      this.addControl(
        controlKey,
        new Control(this, newControlDef, oldSavedControl),
      )
      const newControl = this.getControl(controlKey)
      newControl.setNotatedValue({
        value,
        type: newControlDef.type,
        list: newControlDef.list || false,
      } as NotatedDataTypeValue<true, true>)
    }
  }

  updateInputs = () => {
    //Check if inputs definition exists
    if (!this.definition.inputs) return

    //Resolve inputs definition
    const inputsDefinition = this.resolveInputsDefinition(
      this.definition.inputs,
    )

    //Remove inputs that are not defined in the definition
    const newInputsMap = new Map(inputsDefinition.map((i) => [i.key, i]))
    for (const key of Object.keys(this.inputs)) {
      if (!newInputsMap.has(key)) {
        this.removeSocket(key, 'input')
      }
    }

    for (const inputDef of inputsDefinition) {
      //Add new input if defined and
      if (!this.hasInput(inputDef.key)) {
        this.addInput(inputDef.key, new Input(this, inputDef))
        continue
      }

      //Store the old input and check if it needs to be updated
      const currentInput = this.inputs[inputDef.key]

      if (!currentInput || isEqual(currentInput.definition, inputDef)) continue

      //Store the old input as a serialized object and remove it
      let oldSavedInput = currentInput?.serialize()
      this.removeInput(inputDef.key)

      if (this.definition.type === 'compare') {
        console.log(oldSavedInput)
      }

      //Remove value from old input control if datatype or list changed
      const typeChanged =
        currentInput?.socket.type !== 'generic' &&
        currentInput?.socket.type !== inputDef.type
      const listChanged =
        currentInput?.socket.list &&
        inputDef.list &&
        currentInput?.socket.list !== inputDef.list
      if ((typeChanged || listChanged) && 'control' in oldSavedInput) {
        oldSavedInput = {
          ...oldSavedInput,
          control: {
            ...oldSavedInput.control,
            value: null,
          } as SavedControl,
        }
      }

      //Add the new input
      this.addInput(
        inputDef.key,
        new Input(
          this,
          inputDef,
          oldSavedInput,
          currentInput?.socket.connection,
        ),
      )

      //validate the exiting connections
      this.validateSocketInputConnections(inputDef.key)
    }
    this.context.area.update('node', this.id)
  }

  updateOutputs = () => {
    if (!this.definition.outputs) return

    const outputsDefinition = this.resolveOutputsDefinition(
      this.definition.outputs,
    )
    const newOutputsMap = new Map(outputsDefinition.map((o) => [o.key, o]))
    for (const key of Object.keys(this.outputs)) {
      if (!newOutputsMap.has(key)) {
        this.removeSocket(key, 'output')
      }
    }

    for (const outputDef of outputsDefinition) {
      if (!this.hasOutput(outputDef.key)) {
        this.addOutput(outputDef.key, new Output(this, outputDef))
      } else {
        const currentOutput = this.outputs[outputDef.key]
        if (!currentOutput) continue
        let differentOptions = false
        if (
          currentOutput?.socket.type === 'enum' &&
          outputDef.type === 'enum'
        ) {
          const oldDef = currentOutput.socket.definition as EnumSocketDefinition
          const newDef = outputDef as EnumSocketDefinition
          if (!isEqual(oldDef.options, newDef.options)) {
            differentOptions = true
          }
        }
        if (
          currentOutput?.socket.type !== outputDef.type ||
          currentOutput?.label !== outputDef.label ||
          differentOptions
        ) {
          const oldSavedOutput = currentOutput?.serialize()
          this.removeOutput(outputDef.key)
          this.addOutput(
            outputDef.key,
            new Output(
              this,
              outputDef,
              oldSavedOutput,
              currentOutput.socket.connection,
            ),
          )
          this.validateSocketOutputConnections(outputDef.key)
        }
      }
    }
    this.context.area.update('node', this.id)
  }

  validateSocketInputConnections = (key: string) => {
    const input = this.inputs[key]
    if (!input) return
    const connections = this.getConnections().filter((connection) => {
      return connection.target === this.id && connection.targetInput === key
    })
    if (!connections || connections.length === 0) return
    for (const connection of connections) {
      const source = this.context.editor.getNode(connection.source)
      if (!source) return
      const sourceOutput = source.outputs[connection.sourceOutput]
      if (!sourceOutput) return
      const valid = input.socket.isCompatibleWith(sourceOutput.socket)
      if (!valid) {
        this.context.editor.removeConnection(connection.id)
        sourceOutput.socket.onDisconnect(this, connection)
        input.socket.onDisconnect(this, connection)
        return
      }
    }
  }

  validateAllInputConnections = () => {
    const inputs = this.getConnectedInputs()
    for (const input of inputs) {
      if (!input) return
      this.validateSocketInputConnections(input.key)
    }
  }

  validateSocketOutputConnections = (key: string) => {
    const output = this.outputs[key]
    if (!output) return
    const connections = this.getConnections().filter((connection) => {
      return connection.source === this.id && connection.sourceOutput === key
    })
    if (!connections || connections.length === 0) return
    for (const connection of connections) {
      const target = this.context.editor.getNode(connection.target)
      if (!target) return
      const targetInput = target.inputs[connection.targetInput]
      if (!targetInput) return
      const valid = output.socket.isCompatibleWith(targetInput.socket)
      if (!valid) {
        this.context.editor.removeConnection(connection.id)
        return
      }
    }
  }

  validateAllOutputConnections = () => {
    const outputs = this.getConnectedOutputs()
    for (const outputKey of outputs) {
      if (!outputKey) return
      this.validateSocketOutputConnections(outputKey)
    }
  }

  triggerError = (error: GraphErrorData) => {
    this.error = error
    this.context.area.update('node', this.id)
  }

  clearError = () => {
    this.error = undefined
    this.context.area.update('node', this.id)
  }

  updateSize = () => {
    this.width = this.context.area.nodeViews.get(this.id)?.element.offsetWidth
    this.height = this.context.area.nodeViews.get(this.id)?.element.offsetHeight
  }

  setComment = (comment: string) => {
    this.comment = comment
    this.context.area.update('node', this.id)
    debounce(() => {
      this.context.editor.events.onNodeChanged?.(
        this.context.editor,
        this.serialize(),
      )
    }, 1000)()
  }

  getConnections = () => {
    const { editor } = this.context
    const connections = editor.getConnections()
    return connections.filter((connection) => {
      return connection.source === this.id || connection.target === this.id
    })
  }

  removeInputConnection = (key: string) => {
    const { editor } = this.context
    const connections = this.getConnections()
    const connection = connections.find((connection) => {
      return connection.target === this.id && connection.targetInput === key
    })?.id
    if (!connection) return
    editor.removeConnection(connection)
  }

  removeOutputConnection = (key: string) => {
    const { editor } = this.context
    const connections = this.getConnections()
    const connection = connections.find((connection) => {
      return connection.source === this.id && connection.sourceOutput === key
    })?.id
    if (!connection) return
    editor.removeConnection(connection)
  }

  removeSocket = (key: string, type: 'input' | 'output') => {
    if (type === 'input') {
      if (!this.hasInput(key)) return
      this.removeInput(key)
      this.removeInputConnection(key)
    } else {
      if (!this.hasOutput(key)) return
      this.removeOutput(key)
      this.removeOutputConnection(key)
    }
  }

  isConnectedToNode = (
    node: Node,
    type: 'data' | 'exec',
    side: 'input' | 'output',
  ) => {
    const graph = this.context.editor.getNodemap()
    const startingPoint =
      (side === 'output' && type === 'data') ||
      (side === 'input' && type === 'exec')
        ? 'node'
        : 'this'

    const startNode = startingPoint === 'this' ? this : node
    const targetNode = startingPoint === 'this' ? node : this

    if (type === 'data') {
      let nextNodes = [startNode.id]
      while (nextNodes.length > 0) {
        const connectedNodes = nextNodes.flatMap((nodeId) => {
          const node = graph[nodeId]
          if (!node) return []
          return Object.values(node.inputs)
            .map((input) => {
              if (!isExecInput(input)) return input.connection?.node
            })
            .filter((node) => typeof node === 'string')
        })
        if (connectedNodes.includes(targetNode.id)) return true
        nextNodes = connectedNodes
      }
      return false
    }
    if (type === 'exec') {
      let nextNodes = [startNode.id]
      while (nextNodes.length > 0) {
        const connectedNodes = nextNodes.flatMap((nodeId) => {
          const node = graph[nodeId]
          if (!node) return []
          return Object.values(node.outputs)
            .map((output) => {
              if (isExecOutput(output)) return output.connection?.node
            })
            .filter((node) => typeof node === 'string')
        })
        if (connectedNodes.includes(targetNode.id)) return true
        nextNodes = connectedNodes
      }
      return false
    }
  }

  serializeInput = (key: string): SavedInput => {
    const input = this.inputs[key]
    if (!input) throw new Error(`Input ${key} not found`)
    return input.serialize()
  }

  serializeInputs = (): SavedInputMap => {
    return Object.keys(this.inputs).reduce<SavedInputMap>(
      (accumulator, key) => {
        accumulator[key] = this.serializeInput(key)
        return accumulator
      },
      {},
    )
  }

  serializeOutput = (key: string): SavedOutput => {
    const output = this.outputs[key]
    if (!output) throw new Error(`Output ${key} not found`)
    return output.serialize()
  }

  serializeOutputs = (): SavedOutputMap => {
    return Object.keys(this.outputs).reduce<SavedOutputMap>(
      (accumulator, key) => {
        accumulator[key] = this.serializeOutput(key)
        return accumulator
      },
      {},
    )
  }

  serializeControl = (key: string): SavedControl => {
    const control = this.controls[key]
    if (!control) throw new Error(`Control ${key} not found`)
    return control.serialize()
  }

  serializeControls = (): SavedControlMap => {
    return Object.keys(this.controls).reduce<SavedControlMap>(
      (accumulator, key) => {
        accumulator[key] = this.serializeControl(key)
        return accumulator
      },
      {},
    )
  }

  serialize = (): SavedNode => {
    const inputs = this.serializeInputs()
    const outputs = this.serializeOutputs()
    const controls = this.serializeControls()
    const position = this.context.area.nodeViews.get(this.id)?.position
    return {
      id: this.id,
      type: this.definition.type,
      x: position?.x || null,
      y: position?.y || null,
      inputs,
      controls,
      outputs,
      comment: this.comment,
    }
  }

  serializeToMap = (): SavedMapNode => {
    const inputs = Object.keys(this.inputs).reduce<{
      [key: string]: SavedInput
    }>((accumulator, key) => {
      accumulator[key] = this.serializeInput(key)
      return accumulator
    }, {})
    const outputs = Object.keys(this.outputs).reduce<{
      [key: string]: SavedOutput
    }>((accumulator, key) => {
      accumulator[key] = this.serializeOutput(key)
      return accumulator
    }, {})
    const controls = Object.keys(this.controls).reduce<{
      [key: string]: SavedControl
    }>((accumulator, key) => {
      accumulator[key] = this.serializeControl(key)
      return accumulator
    }, {})
    return {
      id: this.id,
      type: this.definition.type,
      inputs,
      controls,
      outputs,
    }
  }

  duplicate = async () => {
    const initial = this.serialize()

    const node = {
      ...initial,
      id: crypto.randomUUID(),
      x: initial.x ? initial.x + 20 : 0,
      y: initial.y ? initial.y + 20 : 0,
    }

    await this.context.editor.addSavedNode(node)
    return node.id
  }

  remove = async () => {
    await this.context.editor.removeSingleNode(this.id)
  }
}
