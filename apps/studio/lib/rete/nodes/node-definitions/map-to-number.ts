import type { NodeDefinition2, SocketDefinition2 } from '@/types/nodes.types'
import type { MapToNumberNode } from '@repo/engine/src/nodes/map-to-number/interface'
import { getDefinedValuesFromObjectArray } from '@repo/engine/src/datatypes/utils'
import { Decimal } from 'decimal.js'

export const mapToNumberDefinition: NodeDefinition2<MapToNumberNode> = {
  type: 'map-to-number',
  category: 'data',
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
  inputs: ({
    getControlValue,
    getInfoFromInputConnections,
    getConnectedInputKeys,
  }) => {
    const steps = getControlValue('breakpoints').value
    if (!steps) return []
    const seenValues = new Set<number>()

    const definedSteps = getDefinedValuesFromObjectArray<number>(steps)

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
    const { type, settings } = getInfoFromInputConnections(
      getConnectedInputKeys().filter((key) => key !== 'number'),
    )
    const mode = getControlValue('mode').value

    const numberDef: SocketDefinition2<MapToNumberNode, 'inputs', 'number'> = {
      index: 0,
      key: 'number',
      label: 'Number',
      type: 'number',
      hideControl: true,
      dividerAfter: breakpoints.length > 0,
      list: false,
    }

    const valueDefs: SocketDefinition2<MapToNumberNode, 'inputs', string>[] =
      breakpoints?.map((step, index) => {
        const previousBreakpoint =
          index === 0 ? undefined : breakpoints[index - 1]
        return {
          index: index + 1,
          key: index.toString(),
          label:
            index !== 0 && previousBreakpoint
              ? `${previousBreakpoint.value} - ${step.value.toString()}`
              : `${mode === 'up' ? '≤' : '<'}  ${step.value.toString()}`,
          type,
          list: false,
          settings,
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

    const lastStepDef: SocketDefinition2<MapToNumberNode, 'inputs', string> = {
      index: breakpoints.length + 2,
      key: breakpoints.length.toString(),
      label: `${mode === 'up' ? '>' : '≥'} ${breakpoints[breakpoints.length - 1]?.value?.toString()}`,
      type,
      list: false,
      settings,
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

    const inputDefs: SocketDefinition2<MapToNumberNode, 'inputs', string>[] = [
      numberDef,
      ...valueDefs,
    ]
    if (breakpoints.length > 0) {
      inputDefs.push(lastStepDef)
    }

    return inputDefs
  },
  outputs: ({ getInfoFromInputConnections, getConnectedInputKeys }) => {
    const { type, list, settings } = getInfoFromInputConnections(
      getConnectedInputKeys().filter((key) => key !== 'number'),
    )
    return [{ key: 'output', type, list, settings, label: 'Value' }]
  },
}
