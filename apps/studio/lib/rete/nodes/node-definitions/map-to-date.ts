import type {
  SpecificNodeDefinition,
  DataSocketDefinition,
} from '@/types/nodes.types'
import type { MapToDateNode } from '@repo/engine/nodes/map-to-date/interface'
import { getDefinedValuesFromObjectArray } from '@repo/engine/datatypes/utils'
import { DateTime } from 'luxon'
import type {
  NodeCategory,
  SocketInterfaceMap,
  NodeInterface,
} from '@repo/engine/types/node-types'

export const mapToDateDefinition: SpecificNodeDefinition<MapToDateNode> = {
  type: 'map-to-date',
  category: 'data',
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
      settings: {
        default: { value: 'up', type: 'enum', format: 'single' },
        options: [
          { value: 'up', label: 'the range above' },
          { value: 'down', label: 'the range below' },
        ],
      },
    },
  ],
  inputs: ({
    getControlValue,
    getInfoFromInputConnections,
    getConnectedInputKeys,
  }) => {
    const steps = getControlValue('breakpoints')?.value
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
      return {
        id: step.id,
        value: step.value,
        datestring:
          DateTime.fromMillis(step.value).toFormat('yy/MM/dd') || 'Undefined',
      }
    })
    const { type, settings } =
      getInfoFromInputConnections(
        getConnectedInputKeys().filter((key) => key !== 'datetime'),
      ) || {}
    const mode = getControlValue('mode')?.value

    const numberDef: DataSocketDefinition<MapToDateNode, 'inputs', 'datetime'> =
      {
        index: 0,
        key: 'datetime',
        label: 'Number',
        type: 'datetime',
        hideControl: true,
        dividerAfter: breakpoints.length > 0,
        list: false,
      }

    const valueDefs: DataSocketDefinition<MapToDateNode, 'inputs', string>[] =
      breakpoints?.map((step, index) => {
        const previousBreakpoint =
          index === 0 ? undefined : breakpoints[index - 1]
        return {
          index: index + 1,
          key: index.toString(),
          label:
            index !== 0 && previousBreakpoint
              ? `${previousBreakpoint.value} - ${step.datestring}`
              : `${mode === 'up' ? '≤' : '<'}  ${step.datestring}`,
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

    const lastStepDef: DataSocketDefinition<MapToDateNode, 'inputs', string> = {
      index: breakpoints.length + 2,
      key: breakpoints.length.toString(),
      label: `${mode === 'up' ? '>' : '≥'} ${breakpoints[breakpoints.length - 1]?.datestring}`,
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

    const inputDefs: DataSocketDefinition<MapToDateNode, 'inputs', string>[] = [
      numberDef,
      ...valueDefs,
    ]
    if (breakpoints.length > 0) {
      inputDefs.push(lastStepDef)
    }

    return inputDefs
  },
  outputs: ({ getInfoFromInputConnections, getConnectedInputKeys }) => {
    const { type, list, settings } =
      getInfoFromInputConnections(
        getConnectedInputKeys().filter((key) => key !== 'datetime'),
      ) || {}
    return [{ key: 'output', type, list, settings, label: 'Value' }]
  },
}
