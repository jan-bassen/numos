import type {
  DynamicControlsDefinition,
  NodeContext,
  AnyDataSocketDefinition,
  Position,
  NodeDefinition,
  AnyControlDefinition,
  NodeInteractionInterface,
  DefinitionInterface,
  DynamicSocketsDefinition,
  DynamicExecSocketsDefinition,
  ExecSocketDefinition,
} from '@/types/nodes.types'
import type {
  MapGraphNode,
  SavedNode,
  MapGraphDataInput,
  MapGraphConnection,
} from '@repo/shared/types/graph-types'
import { Control } from './control'
import { NodePreset } from './presets'
import { debounce, isEqual } from 'lodash'
import type {
  NodeValueMap,
  Value,
  ValueRestrictions,
  ValueType,
} from '@repo/shared/types/values'
import type { AnyNode } from '@repo/shared/types/node-types'
import { Input } from '@/lib/rete/classes/connectors/input'
import { Output } from '@/lib/rete/classes/connectors/output'
import type { GraphErrorData } from '@repo/shared/types/engine-types'
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

  getConnectedInputs = () => {
    return this.context.editor
      .getConnections()
      .map((connection) => {
        if (connection.target === this.id) {
          return { key: connection.targetInput, connectionId: connection.id }
        }
        return
      })
      .filter((input) => input !== undefined)
  }

  getConnectedOutput = (key: string) => {
    const input = this.getInput(key)
    if (!input) return
    const connection = input.socket.connection
    if (!connection) return
    const output = this.context.editor
      .getNode(connection.source)
      ?.getOutput(connection.sourceOutput)
    return output
  }

  getConnectedOutputs = () => {
    return this.context.editor.getConnections().map((connection) => {
      if (connection.source === this.id) {
        return connection.sourceOutput
      }
      return
    })
  }

  getDefinitionInterface: (
    savedNode?: SavedNode,
  ) => DefinitionInterface<AnyNode> = (savedNode) => {
    return {
      getConnectedInputKeys: () => {
        return this.getConnectedInputs().map((input) => input.key)
      },
      getInfoFromInputConnection: <VT extends ValueType, L extends boolean>(
        key: string,
      ) => {
        const connectedOutput = this.getConnectedOutput(key)
        if (!connectedOutput) return
        if (
          connectedOutput.socket.definition.type === 'exec' ||
          connectedOutput.socket.type === 'generic'
        ) {
          return undefined
        }
        return {
          type: connectedOutput.socket.type as VT,
          list: connectedOutput.socket.list,
          restrictions: connectedOutput.socket.definition
            ?.restrictions as ValueRestrictions<VT, L>,
        }
      },
      getInfoFromInputConnections: <VT extends ValueType, L extends boolean>(
        keys: string[],
      ) => {
        const output = keys
          .map((key) => this.getConnectedOutput(key))
          .find((o) => o !== undefined)
        if (!output) return
        if (
          output.socket.definition.type === 'exec' ||
          output.socket.type === 'generic'
        ) {
          return undefined
        }
        return {
          type: output.socket.type as VT,
          list: output.socket.list,
          restrictions: output.socket.definition
            ?.restrictions as ValueRestrictions<VT, L>,
        }
      },
      getControlValue: (key: string) => {
        const control = this.getControl(key)
        if (control) return control.value
        const savedControl = savedNode?.state?.controls?.[key]
        if (savedControl)
          return {
            value: savedControl.value,
            type: savedControl?.type,
            format: savedControl?.format,
          } as Value<ValueType, 'single' | 'objectarray', true>
        return undefined
      },
      getParameter: (key: string) => {
        const trigger = this.context.editor.context.action?.trigger
        if (!trigger || trigger.type !== 'api') return
        const parameter = trigger.settings.params?.find(
          (param) => param.key === key,
        )
        return parameter
      },
      getParameters: () => {
        const trigger = this.context.editor.context.action?.trigger
        if (!trigger || trigger.type !== 'api') return
        return trigger.settings.params
      },
      getTrigger: () => {
        return this.context.editor.context.action?.trigger || undefined
      },
      getTokenAttribute: (id: string) => {
        const attribute = this.context.editor.context.attributes?.find(
          (attr) => attr.id === id,
        )
        return attribute
      },
      getTokenAttributes: () => {
        return this.context.editor.context.attributes?.filter(
          (attr) => attr.tokenSpecific,
        )
      },
      getCollectionAttribute: (id: string) => {
        return this.context.editor.context.attributes?.find(
          (attr) => attr.id === id,
        )
      },
      getCollectionAttributes: () => {
        return this.context.editor.context.attributes?.filter(
          (attr) => !attr.tokenSpecific,
        )
      },
    }
  }

  interactionInterface: NodeInteractionInterface<AnyNode> = {
    updateInputs: () => {
      this.updateInputs()
    },
    updateOutputs: () => {
      this.updateOutputs()
    },
    updateControls: () => {
      this.updateControls()
    },
    updateControl: (key, value) => {
      this.updateControl(key, value)
    },
  }

  //TODO: Add execs!
  resolveInputsDefinition = (
    definition: DynamicSocketsDefinition<'inputs'>,
    savedNode?: SavedNode,
  ): AnyDataSocketDefinition<'inputs'>[] => {
    if (Array.isArray(definition)) return definition
    return definition(this.getDefinitionInterface(savedNode))
  }

  resolveOutputsDefinition = (
    definition: DynamicSocketsDefinition<'outputs'>,
    savedNode?: SavedNode,
  ): AnyDataSocketDefinition<'outputs'>[] => {
    if (Array.isArray(definition)) return definition
    return definition(this.getDefinitionInterface(savedNode))
  }

  resolveExecOutputsDefinition = (
    definition: DynamicExecSocketsDefinition<AnyNode>,
    savedNode?: SavedNode,
  ): ExecSocketDefinition[] => {
    if (Array.isArray(definition)) return definition
    return definition(this.getDefinitionInterface(savedNode))
  }

  resolveControlsDefinition = (
    definition: DynamicControlsDefinition,
    savedNode?: SavedNode,
  ): AnyControlDefinition[] => {
    if (Array.isArray(definition)) return definition
    return definition(this.getDefinitionInterface(savedNode))
  }

  initialize = (definition: NodeDefinition, savedNode?: SavedNode) => {
    this.comment = savedNode?.comment
    this.initControls(definition, savedNode)
    this.initInputs(definition, savedNode)
    this.initOutputs(definition, savedNode)
    this.context.area.update('node', this.id)
  }

  initControls = (definition: NodeDefinition, savedNode?: SavedNode) => {
    if (!definition.controls) return
    const staticControls = this.resolveControlsDefinition(
      definition.controls,
      savedNode,
    )
    for (const control of staticControls) {
      this.addControl(
        control.key,
        new Control(this, control, savedNode?.state?.controls?.[control.key]),
      )
    }
  }

  initInputs = (definition: NodeDefinition, savedNode?: SavedNode) => {
    if (
      definition.category === 'exec' ||
      (definition.category === 'hybrid' && !definition.root)
    ) {
      this.addInput(
        'exec',
        new Input(this, {
          type: 'exec',
          key: 'exec',
          label: 'Execution',
          index: 0,
        }),
      )
    }
    if (!definition.inputs) return
    const dataInputDefinitions = this.resolveInputsDefinition(
      definition.inputs,
      savedNode,
    )
    for (const dataInputDefinition of dataInputDefinitions) {
      this.addInput(
        dataInputDefinition.key,
        new Input(
          this,
          dataInputDefinition,
          savedNode?.state?.inputs?.[dataInputDefinition.key],
        ),
      )
    }
  }

  initOutputs = (definition: NodeDefinition, savedNode?: SavedNode) => {
    const execOutputs = definition.forwards
    if (execOutputs) {
      const staticExecOutputs = this.resolveExecOutputsDefinition(
        execOutputs,
        savedNode,
      )
      for (const output of staticExecOutputs) {
        this.addOutput(output.key, new Output(this, output))
      }
    }
    if (!definition.outputs) return
    const staticOutputs = this.resolveOutputsDefinition(
      definition.outputs,
      savedNode,
    )
    for (const output of staticOutputs) {
      this.addOutput(output.key, new Output(this, output))
    }
  }

  updateControls = () => {
    if (!this.definition.controls) return
    const oldControls = this.getControls()
    const savedNode = this.save()
    const newControlDefinitions = this.resolveControlsDefinition(
      this.definition.controls,
      savedNode,
    )
    for (const oldControlKey of Object.keys(oldControls)) {
      if (
        !newControlDefinitions.some((socket) => socket.key === oldControlKey)
      ) {
        this.removeControl(oldControlKey)
      }
    }
    for (const control of newControlDefinitions) {
      if (!this.hasControl(control.key)) {
        this.addControl(control.key, new Control(this, control, undefined))
      } else {
        const oldControlValue = oldControls[control.key]?.getValue()
        this.removeControl(control.key)
        this.addControl(
          control.key,
          new Control(this, control, oldControlValue),
        )
      }
    }
    this.context.area.update('node', this.id)
  }

  updateControl = (
    controlKey: string,
    value?: Value<ValueType, 'single' | 'objectarray', true>,
  ) => {
    if (!this.definition.controls) return
    const savedNode = this.save()
    if (this.hasControl(controlKey)) {
      const staticControls = this.resolveControlsDefinition(
        this.definition.controls,
        savedNode,
      )
      const newControlDef = staticControls.find(
        (control) => control.key === controlKey,
      )
      if (!newControlDef) return
      const newValue = value || this.getControl(controlKey)?.getValue()
      this.removeControl(controlKey)
      this.addControl(controlKey, new Control(this, newControlDef, newValue))
    }
  }

  updateInputs = () => {
    if (
      this.definition.category === 'exec' ||
      (this.definition.category === 'hybrid' && !this.definition.root)
    ) {
      if (!this.getInput('exec')) {
        this.addInput(
          'exec',
          new Input(this, {
            type: 'exec',
            key: 'exec',
            label: 'Execution',
            index: 0,
          }),
        )
      }
    }

    if (!this.definition.inputs)
      //Check if inputs definition exists
      return

    //Resolve inputs definition
    const inputsDefinition = this.resolveInputsDefinition(
      this.definition.inputs,
    )

    //Remove inputs that are not defined in the definition
    const newInputsMap = new Map(inputsDefinition.map((i) => [i.key, i]))
    for (const key of Object.keys(this.getInputs())) {
      if (!newInputsMap.has(key) && key !== 'exec') {
        this.removeSocket(key, 'input')
      }
    }

    for (const inputDef of inputsDefinition) {
      //Add new input if defined and not already added
      if (!this.hasInput(inputDef.key)) {
        this.addInput(inputDef.key, new Input(this, inputDef))
        continue
      }

      //Store the old input and check if it needs to be updated
      const currentInput = this.getInput(inputDef.key)
      if (!currentInput || isEqual(currentInput.definition, inputDef)) continue

      //Store the old input control value and remove it
      const oldInputControlValue = currentInput?.getControlValue()
      this.removeInput(inputDef.key)

      //Remove value from old input control if datatype or list changed
      const typeChanged =
        currentInput?.socket.type !== 'generic' &&
        currentInput?.socket.type !== inputDef.type
      const listChanged =
        currentInput?.socket.list &&
        inputDef.list &&
        currentInput?.socket.list !== inputDef.list

      const controlValue =
        typeChanged || listChanged ? undefined : oldInputControlValue

      //Add the new input
      this.addInput(
        inputDef.key,
        new Input(
          this,
          inputDef,
          controlValue,
          currentInput?.socket.connection,
        ),
      )

      //validate the exiting connections
      this.validateSocketInputConnections(inputDef.key)
    }
    this.context.area.update('node', this.id)
  }

  updateOutputs = () => {
    const execOutputs = this.definition.forwards
    if (execOutputs) {
      const staticExecOutputs = this.resolveExecOutputsDefinition(execOutputs)
      for (const output of staticExecOutputs) {
        if (this.getOutput(output.key)) continue
        this.addOutput(output.key, new Output(this, output))
      }
    }
    if (!this.definition.outputs) return

    const outputsDefinition = this.resolveOutputsDefinition(
      this.definition.outputs,
    )
    const newOutputsMap = new Map(outputsDefinition.map((o) => [o.key, o]))
    for (const key of Object.keys(this.getOutputs())) {
      if (!newOutputsMap.has(key)) {
        this.removeSocket(key, 'output')
      }
    }

    for (const outputDef of outputsDefinition) {
      if (!this.hasOutput(outputDef.key)) {
        this.addOutput(outputDef.key, new Output(this, outputDef))
      } else {
        const currentOutput = this.getOutput(outputDef.key)
        if (!currentOutput || currentOutput.socket.definition.type === 'exec')
          continue
        let differentOptions = false
        if (
          //TODO: Clean up these checks
          currentOutput?.socket.type === 'enum' &&
          outputDef.type === 'enum' &&
          currentOutput.socket.definition.restrictions &&
          'options' in currentOutput.socket.definition.restrictions &&
          outputDef.restrictions &&
          'options' in outputDef.restrictions
        ) {
          if (
            !isEqual(
              currentOutput.socket.definition.restrictions.options,
              outputDef.restrictions.options,
            )
          ) {
            differentOptions = true
          }
        }
        if (
          currentOutput?.socket.type !== outputDef.type ||
          currentOutput?.label !== outputDef.label ||
          differentOptions
        ) {
          this.removeOutput(outputDef.key)
          this.addOutput(
            outputDef.key,
            new Output(this, outputDef, currentOutput.socket.connection),
          )
          this.validateSocketOutputConnections(outputDef.key)
        }
      }
    }
    this.context.area.update('node', this.id)
  }

  validateSocketInputConnections = (key: string) => {
    const input = this.getInput(key)
    if (!input) return
    const connections = this.getConnections().filter((connection) => {
      return connection.target === this.id && connection.targetInput === key
    })
    if (!connections || connections.length === 0) return
    for (const connection of connections) {
      const source = this.context.editor.getNode(connection.source)
      if (!source) return
      const sourceOutput = source.getOutput(connection.sourceOutput)
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
    const output = this.getOutput(key)
    if (!output) return
    const connections = this.getConnections().filter((connection) => {
      return connection.source === this.id && connection.sourceOutput === key
    })
    if (!connections || connections.length === 0) return
    for (const connection of connections) {
      const target = this.context.editor.getNode(connection.target)
      if (!target) return
      const targetInput = target.getInput(connection.targetInput)
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

  saveToDb = debounce(() => {
    this.context.editor.events.onNodeChanged?.(this.context.editor, this.save())
  }, 1000)

  setComment = (comment: string) => {
    this.comment = comment
    this.context.area.update('node', this.id)
    this.saveToDb()
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
              return input.connection?.node
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
          return Object.values(node.forwards)
            .map((output) => {
              return output.node
            })
            .filter((node) => typeof node === 'string')
        })
        if (connectedNodes.includes(targetNode.id)) return true
        nextNodes = connectedNodes
      }
      return false
    }
    return false
  }

  getControlValues = (): NodeValueMap => {
    const values = {} as NodeValueMap
    for (const key of this.getControlKeys()) {
      const value = this.getControl(key)?.getValue()
      if (value) values[key] = value
    }
    return values
  }

  getInputValues = (): NodeValueMap => {
    const values = {} as NodeValueMap
    for (const key of this.getInputKeys()) {
      const value = this.getInput(key)?.getControlValue()
      if (value) values[key] = value
    }
    return values
  }

  save = (): SavedNode => {
    const inputs = this.getInputValues()
    const controls = this.getControlValues()
    const position = this.context.area.nodeViews.get(this.id)?.position
    return {
      id: this.id,
      type: this.definition.type,
      x: position?.x || null,
      y: position?.y || null,
      comment: this.comment,
      state: {
        inputs,
        controls,
      },
    }
  }

  saveToMap = (): MapGraphNode => {
    const inputs = this.getDataInputEntries().reduce<
      Record<string, MapGraphDataInput>
    >((accumulator, [key, input]) => {
      if (!input) return accumulator
      const connection = input.socket.connection
      accumulator[key] = {
        controlValue: input.getResolvedControlValue(),
        connection: connection
          ? {
              connectionId: connection.id,
              node: connection.source,
              key: connection.sourceOutput,
            }
          : undefined,
      }
      return accumulator
    }, {})

    const controls = this.getControlEntries().reduce<
      Record<string, Value<ValueType, 'single' | 'array', true>>
    >((accumulator, [key, control]) => {
      if (!control) return accumulator
      accumulator[key] = control.getResolvedValue()
      return accumulator
    }, {})

    const forwards = this.getExecOutputEntries().reduce<
      Record<string, MapGraphConnection>
    >((accumulator, [key, output]) => {
      const connection = output.socket.connection
      if (!connection) return accumulator
      accumulator[key] = {
        connectionId: connection.id,
        node: connection.target,
        key: connection.targetInput,
      }
      return accumulator
    }, {})

    return {
      id: this.id,
      type: this.definition.type,
      root: this.definition.root || false,
      inputs,
      controls,
      forwards,
    }
  }

  duplicate = async (offset?: Position) => {
    const initial = this.save()
    const xOffset = offset ? offset.x : 20
    const yOffset = offset ? offset.y : 20

    const node = {
      ...initial,
      id: crypto.randomUUID(),
      x: initial.x ? initial.x + xOffset : 0,
      y: initial.y ? initial.y + yOffset : 0,
    }

    await this.context.editor.addSavedNode(node)
    return node.id
  }

  remove = async () => {
    await this.context.editor.removeSingleNode(this.id)
  }
}
