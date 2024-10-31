import type { SpecificNodeDefinition, SelectOptions } from '@/types/nodes.types'
import { NodeError } from '@repo/engine/errors/node-error'
import type { CompareNode } from '@repo/engine/nodes/compare/interface'

export const compareDefinition: SpecificNodeDefinition<CompareNode> = {
  type: 'compare',
  category: 'data',
  title: 'Compare',
  root: false,
  componentType: 'generic',
  nodeInfo: {
    description: 'This node allows you to compare two numbers.',
    example: '(Mode: Equal): 1.23 & 2.34 = no',
    link: '#math-compare',
  },
  inputs: ({ getInfoFromInputConnections }) => {
    const { type, list, settings } =
      getInfoFromInputConnections(['value1', 'value2']) || {}
    return [
      {
        key: 'value1',
        type: type,
        list: list,
        canBeList: true,
        label: 'Value 1',
        settings,
        onConnect: (node) => {
          node.updateInputs()
          node.updateControls()
        },
        onDisconnect: (node) => {
          node.updateInputs()
          node.updateControls()
        },
      },
      {
        key: 'value2',
        type: type,
        list: list,
        canBeList: true,
        label: 'Value 2',
        settings,
        onConnect: (node) => {
          node.updateInputs()
          node.updateControls()
        },
        onDisconnect: (node) => {
          node.updateInputs()
          node.updateControls()
        },
      },
    ]
  },
  controls: ({ getInfoFromInputConnections }) => {
    const { type, list } =
      getInfoFromInputConnections(['value1', 'value2']) || {}
    let options: SelectOptions = []
    if (!list) {
      switch (type) {
        case 'number':
          options = [
            { value: 'eq', label: 'Equal' },
            { value: 'ne', label: 'Not Equal' },
            { value: 'lt', label: 'Less Than' },
            { value: 'le', label: 'Less Than or Equal' },
            { value: 'gt', label: 'Greater Than' },
            { value: 'ge', label: 'Greater Than or Equal' },
          ]
          break
        case 'datetime':
          options = [
            { value: 'eq', label: 'Equal' },
            { value: 'ne', label: 'Not Equal' },
            { value: 'lt', label: 'Before' },
            { value: 'le', label: 'Before or Equal' },
            { value: 'gt', label: 'After' },
            { value: 'ge', label: 'After or Equal' },
          ]
          break
        case 'weather':
          options = [
            { value: 'eq', label: 'Equal' },
            { value: 'ne', label: 'Not Equal' },
            { value: 'sc', label: 'Same category' },
            { value: 'dc', label: 'Different category' },
          ]
          break
        case 'string':
          options = [
            { value: 'eq', label: 'Equal' },
            { value: 'ne', label: 'Not Equal' },
            { value: 'starts', label: 'Starts with' },
            { value: 'ends', label: 'Ends with' },
            { value: 'contains', label: 'Contains' },
            { value: 'not-contains', label: 'Does not contain' },
            { value: 'same-length', label: 'Same length' },
            { value: 'different-length', label: 'Different length' },
          ]
          break
        default:
          options = [
            { value: 'eq', label: 'Equal' },
            { value: 'ne', label: 'Not Equal' },
          ]
          break
      }
    } else {
      options = [
        { value: 'eq', label: 'Equal' },
        { value: 'ne', label: 'Not Equal' },
        { value: 'same-length', label: 'Same length' },
        { value: 'different-length', label: 'Different length' },
      ]
    }
    return [
      {
        key: 'mode',
        type: 'enum',
        label: 'Select Mode',
        defaultValue: 'eq',
        options,
      },
    ]
  },
  outputs: [{ key: 'output', type: 'boolean', label: 'Result' }],
}
