import type {
  Attribute,
  DatatypeObjectValue,
  EnumSettings,
  NotatedListNumberValue,
  ValueSettings,
} from '@/types/database.types'
import type {
  ControlDefinition,
  NodeDefinitions,
  SelectOptions,
  SocketDefinition,
} from '@/types/nodes.types'
import {
  getTypeFromInputConnections,
  getTypeFromTwoInputConnections,
} from './utils'
import Decimal from 'decimal.js'
import { DateTime } from 'luxon'

export type DataNodeType =
  | 'enum-input'
  | 'number-input'
  | 'text-input'
  | 'attribute-data'
  | 'parameter-data'
  | 'meta-data'
  | 'boolean-input'
  | 'address-input'
  | 'color-input'
  | 'datetime-input'
  | 'location-input'
  | 'weather-input'
  | 'direction-input'
  | 'data-switch'
  | 'map-to-number'
  | 'map-to-date'
  | 'map-to-choice'

export const dataNodes: NodeDefinitions<DataNodeType> = {
  'attribute-data': {
    type: 'attribute-data',
    title: 'Attribute',
    root: false,
    componentType: 'generic',
    nodeInfo: {
      description:
        'This node allows you to get the value of an attribute from the token.',
      link: '#attribute',
    },
    controls: (node) => {
      const attributes = node.context.editor.context?.attributes
      const options = attributes?.map((attribute) => {
        return {
          value: attribute.slug,
          label: attribute.name || 'Unnamed Attribute',
        }
      })
      return [
        {
          key: 'attribute',
          type: 'enum',
          placeholder: 'Select Attribute',
          options: options,
          onChange: () => {
            node.updateOutputs()
          },
        },
      ]
    },
    outputs: (node) => {
      const attributes = node.context.editor.context?.attributes
      const attribute = attributes?.find(
        (attribute) => attribute.slug === node.controls.attribute?.value.value,
      )
      if (!attribute) return []
      let options: SelectOptions | undefined
      if (attribute.type === 'enum') {
        const settings = attribute.settings as EnumSettings
        if (settings.options) {
          options = settings.options.map((option) => {
            return {
              value: option.value,
              label: option.label || option.value,
            }
          })
        }
      }
      return [
        {
          key: 'attribute',
          type: attribute.type,
          list: attribute.list,
          label: attribute.name || 'Unnamed Attribute',
          options,
        },
      ]
    },
  },
  'parameter-data': {
    type: 'parameter-data',
    title: 'Parameter',
    root: false,
    componentType: 'generic',
    nodeInfo: {
      description:
        "This node outputs the value of a parameter, which is the same value as you'll get from the Trigger node.",
      link: '#parameter',
    },
    controls: (node) => {
      const parameters = node.context.editor.context?.parameters
      const options = parameters?.map((parameter) => {
        return {
          value: parameter.key,
          label: parameter.key,
        }
      })
      return [
        {
          key: 'parameter',
          type: 'enum',
          placeholder: 'Select Parameter',
          options: options,
          onChange: () => {
            node.updateOutputs()
          },
        },
      ]
    },
    outputs: (node) => {
      const parameters = node.context.editor.context?.parameters
      const parameter = parameters?.find(
        (parameter) => parameter.key === node.controls.parameter?.value.value,
      )
      if (!parameter) return []
      return [
        {
          key: 'parameter',
          list: parameter.list,
          type: parameter.type,
          label: parameter.key,
        },
      ]
    },
  },
  'meta-data': {
    type: 'meta-data',
    title: 'Metadata',
    root: false,
    componentType: 'generic',
    nodeInfo: {
      description: 'This node allows you to get the metadata of a token.',
      link: '#meta-data',
    },
    outputs: [
      {
        key: 'id',
        type: 'number',
        label: 'ID',
      },
      {
        key: 'name',
        type: 'string',
        label: 'Name',
      },
      {
        key: 'description',
        type: 'string',
        label: 'Description',
      },
    ],
  },
  'enum-input': {
    type: 'enum-input',
    title: 'Choice',
    root: false,
    componentType: 'generic',
    nodeInfo: {
      description:
        'This node allows you to get the options of an choice attribute in case you want to set one manually.',
      link: '#attribute',
    },
    controls: (node, savedControls) => {
      const attributes = node.context.editor.context?.attributes as Attribute[]
      const enumAttributes = attributes.filter(
        (attribute) => attribute.type === 'enum',
      )
      const attributeOptions = enumAttributes?.map((attribute) => {
        return {
          value: attribute.slug,
          label: attribute.name || 'Unnamed Attribute',
        }
      })
      const controls: ControlDefinition[] = [
        {
          key: 'attribute',
          type: 'enum',
          label: 'Attribute',
          placeholder: 'Select Choice Attribute',
          options: attributeOptions,
          onChange: () => {
            node.updateControls()
            node.updateControl('output', null)
            node.updateOutputs()
          },
        },
      ]
      const value =
        node.controls.attribute?.value.value || savedControls?.attribute?.value
      if (value) {
        const attr = enumAttributes?.find(
          (attribute) => attribute.slug === value,
        )?.settings as EnumSettings

        const options = attr?.options?.map((option) => {
          return {
            value: option.value,
            label: option.label || option.value,
          }
        })
        if (attr?.options && attr.options.length > 0) {
          controls.push({
            key: 'output',
            type: 'enum',
            options: options,
            label: 'Choice',
          })
        }
      }
      return controls
    },
    outputs: (node) => {
      const value = node.controls.attribute?.value.value
      if (value) {
        const attributes = node.context.editor.context
          ?.attributes as Attribute[]
        const attribute = attributes?.find(
          (attribute) => attribute.slug === value,
        )
        if (!attribute) return []
        const settings = attribute.settings as EnumSettings
        if (!settings.options) return []
        const options = settings?.options?.map((option) => {
          return {
            value: option.value,
          }
        })
        return [
          {
            key: 'output',
            type: 'enum',
            label: 'Choice',
            options,
          },
        ]
      }
      return []
    },
  },
  'number-input': {
    type: 'number-input',
    title: 'Number',
    root: false,
    componentType: 'input',
    nodeInfo: {
      description: 'This node allows you to input a number.',
      link: '#number-input',
    },
    controls: [{ key: 'number', type: 'number' }],
    outputs: [{ key: 'output', type: 'number', label: 'Output' }],
  },
  'text-input': {
    type: 'text-input',
    title: 'Text',
    root: false,
    componentType: 'input',
    nodeInfo: {
      description: 'This node allows you to input a string of text.',
      link: '#text-input',
    },
    controls: [{ key: 'text', type: 'string' }],
    outputs: [{ key: 'output', type: 'string', label: 'Output' }],
  },
  'boolean-input': {
    type: 'boolean-input',
    title: 'Yes/No',
    root: false,
    componentType: 'input',
    nodeInfo: {
      description:
        'This node allows you to input a boolean (true/false) value.',
      link: '#boolean-input',
    },
    controls: [{ key: 'boolean', type: 'boolean' }],
    outputs: [{ key: 'output', type: 'boolean', label: 'Output' }],
  },
  'address-input': {
    type: 'address-input',
    title: 'Address',
    root: false,
    componentType: 'input',
    nodeInfo: {
      description: 'This node allows you to input a blockchain address.',
      example: '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D',
      link: '#address-input',
    },
    controls: [
      {
        key: 'address',
        type: 'address',
        placeholder: '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D',
      },
    ],
    outputs: [{ key: 'output', type: 'address', label: 'Address' }],
  },
  'color-input': {
    type: 'color-input',
    title: 'Color',
    root: false,
    componentType: 'input',
    nodeInfo: {
      description: 'This node allows you to input a color.',
      link: '#color-input',
    },
    controls: [{ key: 'color', type: 'color' }],
    outputs: [{ key: 'output', type: 'color', label: 'Color' }],
  },
  'datetime-input': {
    type: 'datetime-input',
    title: 'Datetime',
    root: false,
    componentType: 'input',
    nodeInfo: {
      description: 'This node allows you to input a datetime.',
      link: '#datetime-input',
    },
    controls: [{ key: 'datetime', type: 'datetime' }],
    outputs: [{ key: 'output', type: 'datetime', label: 'Datetime' }],
  },
  'location-input': {
    type: 'location-input',
    title: 'Location',
    root: false,
    componentType: 'input',
    nodeInfo: {
      description: 'This node allows you to input a location.',
      link: '#location-input',
    },
    controls: [{ key: 'location', type: 'location' }],
    outputs: [{ key: 'output', type: 'location', label: 'Location' }],
  },
  'weather-input': {
    type: 'weather-input',
    title: 'Weather',
    root: false,
    componentType: 'input',
    nodeInfo: {
      description: 'This node allows you to input a weather condition.',
      link: '#weather-input',
    },
    controls: [{ key: 'weather', type: 'weather' }],
    outputs: [{ key: 'output', type: 'weather', label: 'Weather' }],
  },
  'direction-input': {
    type: 'direction-input',
    title: 'Direction',
    root: false,
    componentType: 'input',
    nodeInfo: {
      description: 'This node allows you to input a simple direction.',
      link: '#direction-input',
    },
    controls: [{ key: 'direction', type: 'direction' }],
    outputs: [{ key: 'output', type: 'direction', label: 'Direction' }],
  },
  'data-switch': {
    type: 'data-switch',
    title: 'Map to Yes/No',
    root: false,
    componentType: 'generic',
    nodeInfo: {
      description: 'This node allows you to switch between two data inputs.',
      link: '#data-switch',
    },
    inputs: ({ inputs, updateInputs, updateOutputs }) => {
      const { type, options, list } = getTypeFromTwoInputConnections(
        inputs,
        'true',
        'false',
      )
      return [
        {
          key: 'switch',
          type: 'boolean',
          label: 'Switch',
        },
        {
          key: 'true',
          type: type,
          list: list,
          label: 'If Yes',
          canBeList: true,
          options,
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
          key: 'false',
          type: type,
          list: list,
          label: 'If No',
          canBeList: true,
          options,
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
    outputs: ({ inputs }) => {
      const { type, list, options } = getTypeFromTwoInputConnections(
        inputs,
        'true',
        'false',
      )
      return [{ key: 'output', type, list, label: 'Result', options }]
    },
  },
  'map-to-number': {
    type: 'map-to-number',
    title: 'Map to Number Range',
    root: false,
    componentType: 'generic',
    nodeInfo: {
      description:
        'This node allows you to map values to different number ranges. To do that, you can define a list of breakpoints that define the boundaries of the ranges. One breakpoint simultaneously defines the lower  boundary of one range and the upper boundary of the next range. Then you define different values for each range and the node will return the value that is defined for the range that the number value is in. For the case that the number value exactly equals a breakpoint, you can additionally define which range gets chosen.',
      link: '#map-to-number',
    },
    controls: [
      {
        key: 'breakpoints',
        type: 'number',
        list: true,
        label: 'Breakpoints',
        onChange: (node) => {
          node.updateInputs()
        },
      },
      {
        key: 'mode',
        type: 'enum',
        label: 'Breakpoint counts to',
        defaultValue: 'up',
        options: [
          { value: 'up', label: 'the range above' },
          { value: 'down', label: 'the range below' },
        ],
      },
    ],
    inputs: ({ controls, inputs, getConnectedInputs }) => {
      const stepsControl = controls?.breakpoints
      if (!stepsControl) throw new Error('No steps control')
      const steps = stepsControl.value as
        | NotatedListNumberValue<true, true>
        | undefined
      if (!steps || !steps.value) return []
      const seenValues = new Set<number>()
      const definedSteps = steps.value.filter(
        (step) => step.value !== null && step.value !== undefined,
      ) as unknown as DatatypeObjectValue<number, false>[]
      const filteredSteps = definedSteps.filter((step) => {
        if (seenValues.has(step.value)) {
          return false
        }
        seenValues.add(step.value)
        return true
      })
      const sortedSteps = filteredSteps.sort((a, b) => a.value - b.value)
      const breakpoints = sortedSteps.map((step) => {
        const numberValue = new Decimal(step.value).toDecimalPlaces(2)
        return { id: step.id, value: numberValue.toNumber() }
      })
      const type = getTypeFromInputConnections(
        inputs,
        getConnectedInputs()
          .map((c) => c.key)
          .filter((key) => key !== 'number'),
      )
      const modeControl = controls?.mode
      if (!modeControl) throw new Error('No mode control')
      const mode = modeControl.value.value as 'up' | 'down'
      const numberDef: SocketDefinition = {
        index: 0,
        key: 'number',
        label: 'Number',
        type: 'number',
        hideControl: true,
        dividerAfter: breakpoints.length > 0,
        list: false,
      }
      const valueDefs: SocketDefinition[] = breakpoints?.map((step, index) => {
        const previousBreakpoint =
          index === 0 ? undefined : breakpoints[index - 1]

        return {
          index: index + 1,
          key: index.toString(),
          label:
            index !== 0 && previousBreakpoint
              ? `${previousBreakpoint.value} - ${step.value.toString()}`
              : `${mode === 'up' ? '≤' : '<'}  ${step.value.toString()}`,
          type: type.type,
          list: false,
          options: type.options,
          onConnect: (node) => {
            node.updateInputs()
            node.updateOutputs()
          },
          onDisconnect: (node) => {
            node.updateInputs()
            node.updateOutputs()
          },
          hideControl: true,
        }
      })
      const lastStepDef: SocketDefinition = {
        index: breakpoints.length + 2,
        key: breakpoints.length.toString(),
        label: `${mode === 'up' ? '>' : '≥'} ${breakpoints[breakpoints.length - 1]?.value?.toString()}`,
        type: type.type,
        list: false,
        // @ts-ignore
        options: type.options,
        hideControl: true,
        onConnect: (node) => {
          node.updateInputs()
          node.updateOutputs()
        },
        onDisconnect: (node) => {
          node.updateInputs()
          node.updateOutputs()
        },
      }
      const inputDefs: SocketDefinition[] = [numberDef, ...valueDefs]
      if (breakpoints.length > 0) {
        inputDefs.push(lastStepDef)
      }
      return inputDefs
    },
    outputs: ({ inputs, getConnectedInputs }) => {
      const { type, list, options } = getTypeFromInputConnections(
        inputs,
        getConnectedInputs()
          .map((c) => c.key)
          .filter((key) => key !== 'number'),
      )
      return [{ key: 'output', type, list, options, label: 'Value' }]
    },
  },
  'map-to-date': {
    type: 'map-to-date',
    title: 'Map to Time Range',
    root: false,
    componentType: 'generic',
    nodeInfo: {
      description:
        'This node allows you to map values to different time/date ranges. To do that, you can define a list of breakpoints that define the boundaries of the ranges. One breakpoint simultaneously defines the lower  boundary of one range and the upper boundary of the next range. Then you define different values for each range and the node will return the value that is defined for the range that the date value is in. For the case that the date value exactly equals a breakpoint, you can additionally define which range gets chosen.',
      link: '#',
    },
    controls: [
      {
        key: 'breakpoints',
        type: 'datetime',
        list: true,
        label: 'Breakpoints',
        onChange: (node) => {
          node.updateInputs()
        },
      },
      {
        key: 'mode',
        type: 'enum',
        label: 'Breakpoint counts to',
        defaultValue: 'up',
        onChange: (node) => {
          node.updateInputs()
        },
        options: [
          { value: 'up', label: 'the range above' },
          { value: 'down', label: 'the range below' },
        ],
      },
    ],
    inputs: ({ controls, inputs, getConnectedInputs }) => {
      const stepsControl = controls?.breakpoints
      if (!stepsControl) throw new Error('No steps control')
      const steps = stepsControl.value as
        | NotatedListNumberValue<true, true>
        | undefined
      if (!steps || !steps.value) return []
      const seenValues = new Set<number>()
      const definedSteps = steps.value.filter(
        (step) => step.value !== null && step.value !== undefined,
      ) as unknown as DatatypeObjectValue<number, false>[]
      const filteredSteps = definedSteps.filter((step) => {
        if (seenValues.has(step.value)) {
          return false
        }
        seenValues.add(step.value)
        return true
      })
      const sortedSteps = filteredSteps.sort((a, b) => a.value - b.value)
      const breakpoints = sortedSteps.map((step) => {
        return {
          id: step.id,
          value: step.value,
          datestring:
            DateTime.fromMillis(step.value).toFormat('yy/MM/dd') || 'Undefined',
        }
      })
      const type = getTypeFromInputConnections(
        inputs,
        getConnectedInputs()
          .map((c) => c.key)
          .filter((key) => key !== 'datetime'),
      )
      const modeControl = controls?.mode
      if (!modeControl) throw new Error('No mode control')
      const mode = modeControl.value.value as 'up' | 'down'
      const numberDef: SocketDefinition = {
        index: 0,
        key: 'datetime',
        label: 'Datetime',
        type: 'datetime',
        hideControl: true,
        dividerAfter: breakpoints.length > 0,
        list: false,
      }
      const valueDefs: SocketDefinition[] = breakpoints?.map((step, index) => {
        const previousBreakpoint =
          index === 0 ? undefined : breakpoints[index - 1]
        return {
          index: index + 1,
          key: index.toString(),
          label:
            index !== 0 && previousBreakpoint
              ? `${previousBreakpoint.datestring} - ${step.datestring}`
              : `${mode === 'up' ? '≤' : '<'} ${step.datestring}`,
          type: type.type,
          list: false,
          options: type.options,
          onConnect: (node) => {
            node.updateInputs()
            node.updateOutputs()
          },
          onDisconnect: (node) => {
            node.updateInputs()
            node.updateOutputs()
          },
          hideControl: true,
        }
      })
      const lastStepDef: SocketDefinition = {
        index: breakpoints.length + 2,
        key: breakpoints.length.toString(),
        label: `${mode === 'up' ? '>' : '≥'} ${breakpoints[breakpoints.length - 1]?.datestring}`,
        type: type.type,
        list: false,
        // @ts-ignore
        options: type.options,
        hideControl: true,
        onConnect: (node) => {
          node.updateInputs()
          node.updateOutputs()
        },
        onDisconnect: (node) => {
          node.updateInputs()
          node.updateOutputs()
        },
      }
      const inputDefs: SocketDefinition[] = [numberDef, ...valueDefs]
      if (breakpoints.length > 0) {
        inputDefs.push(lastStepDef)
      }
      return inputDefs
    },
    outputs: ({ inputs, getConnectedInputs }) => {
      const { type, list, options } = getTypeFromInputConnections(
        inputs,
        getConnectedInputs()
          .map((c) => c.key)
          .filter((key) => key !== 'datetime'),
      )
      return [{ key: 'output', type, list, options, label: 'Value' }]
    },
  },
  'map-to-choice': {
    type: 'map-to-choice',
    title: 'Map to Choice',
    root: false,
    componentType: 'generic',
    nodeInfo: {
      description:
        'This node allows you to map a value to every option of a choice attribute.',
      link: '#attribute',
    },
    inputs: (node) => {
      const sourceOutput =
        node.inputs.value?.socket.connection?.getSourceOutput()
      if (!sourceOutput) throw new Error('No source output')
      const sourceSocket = sourceOutput.socket
      const def = sourceSocket?.definition
      const options = def && 'options' in def ? def.options : undefined
      const {
        type,
        list,
        options: inputOptions,
      } = getTypeFromInputConnections(
        node.inputs,
        node
          .getConnectedInputs()
          .map((c) => c.key)
          .filter((key) => key !== 'value'),
      )
      const optionsInputs: SocketDefinition[] =
        options?.map((option) => {
          return {
            key: option.value,
            type,
            list,
            options: inputOptions,
            hideControl: true,
            label: option.value,
            onConnect: (node) => {
              node.updateInputs()
              node.updateOutputs()
            },
            onDisconnect: (node) => {
              node.updateInputs()
              node.updateOutputs()
            },
          }
        }) || []
      const valueInput: SocketDefinition = {
        key: 'value',
        type: 'enum',
        label: 'Choice Value',
        options,
        adaptOptions: true,
        dividerAfter: optionsInputs.length > 0,
        hideControl: true,
        list: false,
        onConnect: (node) => {
          node.updateInputs()
          node.updateOutputs()
        },
        onDisconnect: (node) => {
          node.updateInputs()
          node.updateOutputs()
        },
      }
      console.log(valueInput)
      return [valueInput, ...optionsInputs]
    },
    outputs: ({ inputs, getConnectedInputs }) => {
      const { type, list, options } = getTypeFromInputConnections(
        inputs,
        getConnectedInputs()
          .map((c) => c.key)
          .filter((key) => key !== 'value'),
      )
      const output: SocketDefinition = {
        key: 'output',
        type,
        label: 'Output',
        list,
        // @ts-ignore
        options,
      }

      return type === 'generic' ? [] : [output]
    },
  },
}
