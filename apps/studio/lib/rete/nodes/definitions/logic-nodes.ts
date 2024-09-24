import {
  type NodeDefinitions,
  ControlDefinition,
  SocketDefinition,
  type SelectOptions,
  EnumSocketDefinition,
  EnumControlDefinition,
} from '@/types/nodes.types'
import { SocketType } from '@/types/database.types'
import { getTypeFromTwoInputConnections } from './utils'

export type LogicNodeType = 'logic' | 'compare'

export const logicNodes: NodeDefinitions<LogicNodeType> = {
  logic: {
    type: 'logic',
    title: 'Logic',
    root: false,
    componentType: 'generic',
    nodeInfo: {
      description: 'This node allows you to combine multiple inputs.',
      example: '(Mode: And): yes && no = no',
      link: '#logic',
    },
    inputs: ({ controls }) => {
      const modeControl = controls.mode
      if (!modeControl) throw new Error('No mode control')
      const mode = modeControl.value.value
      if (mode === 'not')
        return [{ key: 'boolean1', type: 'boolean', label: 'Boolean' }]
      return [
        { key: 'boolean1', type: 'boolean', label: 'Boolean 1' },
        { key: 'boolean2', type: 'boolean', label: 'Boolean 2' },
      ]
    },
    controls: [
      {
        key: 'mode',
        type: 'enum',
        label: 'Select Mode',
        defaultValue: 'and',
        onChange: (node) => {
          node.updateInputs()
        },
        options: [
          { value: 'and', label: 'And' },
          { value: 'or', label: 'Or' },
          { value: 'not', label: 'Not' },
          { value: 'xor', label: 'Xor' },
          { value: 'nand', label: 'Nand' },
        ],
      },
    ],
    outputs: [{ key: 'output', type: 'boolean', label: 'Output' }],
  },
  compare: {
    type: 'compare',
    title: 'Compare',
    root: false,
    componentType: 'generic',
    nodeInfo: {
      description: 'This node allows you to compare two numbers.',
      example: '(Mode: Equal): 1.23 & 2.34 = no',
      link: '#math-compare',
    },
    inputs: ({ inputs, updateInputs, updateControls }) => {
      const { type, list, options } = getTypeFromTwoInputConnections(
        inputs,
        'value1',
        'value2',
      )
      console.log(type)
      return [
        {
          key: 'value1',
          type: type,
          list: list,
          canBeList: true,
          label: 'Value 1',
          options,
          onConnect: () => {
            updateInputs()
            updateControls()
          },
          onDisconnect: () => {
            updateInputs()
            updateControls()
          },
        },
        {
          key: 'value2',
          type: type,
          list: list,
          canBeList: true,
          label: 'Value 2',
          options,
          onConnect: () => {
            updateInputs()
            updateControls()
          },
          onDisconnect: () => {
            updateInputs()
            updateControls()
          },
        },
      ]
    },
    controls: ({ inputs }) => {
      const type1 = inputs.value1?.socket?.connection?.type
      const type2 = inputs.value2?.socket?.connection?.type
      const type = type1 !== 'generic' && type1 ? type1 : type2 || 'generic'
      const list1 = inputs.value1?.socket?.connection?.list || false
      const list2 = inputs.value2?.socket?.connection?.list || false
      const list = list1 || list2
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
  },
}
