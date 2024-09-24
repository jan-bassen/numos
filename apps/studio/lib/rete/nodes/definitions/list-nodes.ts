import type {
  EnumSocketDefinition,
  NodeDefinitions,
  SelectOptions,
  SocketDefinition,
} from '@/types/nodes.types'
import {
  getTypeFromInputConnections,
  getTypeFromTwoInputConnections,
} from './utils'

export type ListNodeType =
  | 'list-append'
  | 'list-prepend'
  | 'list-length'
  | 'is-in-list'

export const listNodes: NodeDefinitions<ListNodeType> = {
  /* 'list-input': {
    type: 'list-input',
    title: 'List',
    root: false,
    componentType: 'generic',
    nodeInfo: {
      description: 'This node allows you to input a list of values.',
      link: '#list-input',
    },
    controls: (node, savedControls) => {
      return [
        {
          key: 'length',
          type: 'number',
          label: 'Length',
          defaultValue: 1,
          onChange: () => {
            node.updateInputs()
            node.updateOutputs()
          },
          settings: {
            min: 1,
            max: 100,
          },
        },
      ]
    },
    inputs: ({ context, inputs, controls, updateInputs, updateOutputs }) => {
      const newInputKeys: string[] = []
      const length = (controls.length.value as number) || 1
      console.log(length)
      for (let i = 0; i < length; i++) {
        newInputKeys.push((i + 1).toString())
      }
      const type = getTypeFromInputConnections(inputs, newInputKeys)
      const newInputs: SocketDefinition[] = []
      for (const key in newInputKeys) {
        newInputs.push({
          key,
          type: type.type,
          label: `Value ${key}`,
          hideControl: true,
          onConnect: () => {
            updateOutputs()
            updateInputs()
          },
          onDisconnect: () => {
            updateOutputs()
            updateInputs()
          },
        })
      }
      return newInputs
    },
    outputs: ({ inputs, controls }) => {
      const newInputKeys: string[] = []
      const length = (controls.length.value as number) || 1
      for (let i = 1; i < length + 1; i++) {
        newInputKeys.push(i.toString())
      }
      const type = getTypeFromInputConnections(inputs, newInputKeys)
      return [{ key: 'output', type: type.type, list: true, label: 'List' }]
    },
  }, */
  'list-append': {
    type: 'list-append',
    title: 'Append',
    root: false,
    componentType: 'generic',
    nodeInfo: {
      description: 'This node allows you to append a value to a list.',
      link: '#list-append',
      example: '(List: [1, 2, 3], Value: 4) = [1, 2, 3, 4]',
    },
    inputs: ({ inputs, updateInputs, updateOutputs }) => {
      const { type, options } = getTypeFromTwoInputConnections(
        inputs,
        'list',
        'value',
      )
      return [
        {
          key: 'list',
          type,
          options,
          list: true,
          label: 'List',
          hideControl: true,
          onConnect: () => {
            updateOutputs()
            updateInputs()
          },
          onDisconnect: () => {
            updateOutputs()
            updateInputs()
          },
        },
        {
          key: 'value',
          type,
          options,
          label: 'Value',
          hideControl: true,
          onConnect: () => {
            updateOutputs()
            updateInputs()
          },
          onDisconnect: () => {
            updateOutputs()
            updateInputs()
          },
        },
      ]
    },
    outputs: ({ inputs, controls }) => {
      const type = getTypeFromTwoInputConnections(inputs, 'list', 'value').type
      return [{ key: 'output', type, list: true, label: 'List' }]
    },
  },
  'list-prepend': {
    type: 'list-prepend',
    title: 'Prepend',
    root: false,
    componentType: 'generic',
    nodeInfo: {
      description: 'This node allows you to prepend a value to a list.',
      link: '#list-prepend',
      example: '(List: [1, 2, 3], Value: 4) = [4, 1, 2, 3]',
    },
    inputs: ({ inputs, updateInputs, updateOutputs }) => {
      const { type, options } = getTypeFromTwoInputConnections(
        inputs,
        'list',
        'value',
      )
      return [
        {
          key: 'list',
          type,
          list: true,
          options,
          label: 'List',
          hideControl: true,
          onConnect: () => {
            updateOutputs()
            updateInputs()
          },
          onDisconnect: () => {
            updateOutputs()
            updateInputs()
          },
        },
        {
          key: 'value',
          type,
          options,
          label: 'Value',
          hideControl: true,
          onConnect: () => {
            updateOutputs()
            updateInputs()
          },
          onDisconnect: () => {
            updateOutputs()
            updateInputs()
          },
        },
      ]
    },
    outputs: ({ inputs, controls }) => {
      const { type, options } = getTypeFromTwoInputConnections(
        inputs,
        'list',
        'value',
      )
      return [{ key: 'output', type, options, list: true, label: 'List' }]
    },
  },
  'list-length': {
    type: 'list-length',
    title: 'Length of List',
    root: false,
    componentType: 'generic',
    nodeInfo: {
      description: 'This node returns the number of items in a list.',
      link: '#list-length',
    },
    inputs: ({ inputs, updateInputs, updateOutputs }) => {
      const type = inputs.list?.socket.connection?.type || 'generic'
      let options: SelectOptions | undefined
      if (type === 'enum') {
        const outputDef = inputs.list?.socket.connection?.getSourceOutput()
          ?.socket.definition as EnumSocketDefinition
        options = outputDef.options
      }
      return [
        {
          key: 'list',
          type,
          options,
          list: true,
          label: 'List',
          onConnect: () => {
            updateInputs()
            updateOutputs()
          },
          onDisconnect: () => {
            updateInputs()
            updateOutputs()
          },
        },
      ]
    },
    outputs: [{ key: 'output', type: 'number', label: 'Length' }],
  },
  'is-in-list': {
    type: 'is-in-list',
    title: 'Is in List',
    root: false,
    componentType: 'generic',
    nodeInfo: {
      description: 'This node allows you to check if a value is in a list.',
      link: '#list-length',
      example: '(List: [1, 2, 3], Value: 2) = true',
    },
    inputs: ({ inputs, updateInputs, updateOutputs }) => {
      const { type, options } = getTypeFromTwoInputConnections(
        inputs,
        'list',
        'value',
      )
      return [
        {
          key: 'list',
          type,
          list: true,
          label: 'List',
          options,
          hideControl: true,
          onConnect: () => {
            updateInputs()
            updateOutputs()
          },
          onDisconnect: () => {
            updateInputs()
            updateOutputs()
          },
        },
        {
          key: 'value',
          type,
          options,
          label: 'Value',
          hideControl: true,
          onConnect: () => {
            updateInputs()
            updateOutputs()
          },
          onDisconnect: () => {
            updateInputs()
            updateOutputs()
          },
        },
      ]
    },
    outputs: [{ key: 'output', type: 'boolean', label: 'Is in List' }],
  },
}
