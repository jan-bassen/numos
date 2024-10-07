import type { NodeLogicDefinitions } from '@/types/nodes.types'
import type { DataNodeType } from '../definitions/data-nodes'
import { GraphError } from '@/lib/errors'
import type {
  Color,
  Direction,
  Location,
  NotatedDataTypeValue,
  NotatedDatetimeValue,
  WeatherCode,
} from '@/types/database.types'
import { th } from 'date-fns/locale'

export const dataNodesLogic: NodeLogicDefinitions<DataNodeType> = {
  'attribute-data': {
    simulate: {
      outputs: {
        attribute: ({ controls, node, state }) => {
          const attributeKey = controls?.attribute.value as string | undefined
          if (attributeKey === undefined) {
            throw new GraphError(
              `Attribute with slug ${controls?.attribute} not found`,
              node.id,
              { type: 'control', id: node.controls.attribute.key },
            )
          }
          const attribute = state.attributes[attributeKey]
          if (
            !attribute ||
            attribute.value === undefined ||
            attribute.value === null
          ) {
            throw new GraphError(
              'Attribute is used, but not defined in the inputs.',
              node.id,
              { type: 'output', id: node.outputs.attribute.id },
              {
                type: 'attributes',
                key: attributeKey,
              },
            )
          }
          return {
            type: attribute.type,
            list: attribute.list,
            value: attribute.value,
          } as NotatedDataTypeValue
        },
      },
    },
  },
  'parameter-data': {
    simulate: {
      outputs: {
        parameter: ({ controls, node, state, context }) => {
          const parameterKey = controls?.parameter.value as string
          const parameter = context.parameters?.[parameterKey]
          if (
            !parameter ||
            parameter.value === undefined ||
            parameter.value === undefined
          ) {
            throw new GraphError(
              `Parameter ${parameterKey} is used, but not defined in the inputs.`,
              node.id,
              {
                type: 'output',
                id: node.outputs.parameter.id,
              },
              {
                type: 'parameters',
                key: parameterKey,
              },
            )
          }
          return parameter
        },
      },
    },
  },
  'meta-data': {
    simulate: {
      outputs: {
        id: ({ node, state }) => {
          if (state.metadata.id === undefined || state.metadata.id === null) {
            throw new GraphError(
              'Token ID is used, but not defined in the inputs.',
              node.id,
              {
                type: 'output',
                id: node.outputs.id.id,
              },
              {
                type: 'metadata',
                key: 'id',
              },
            )
          }
          return { type: 'number', list: false, value: state.metadata.id }
        },
        name: ({ node, state }) => {
          if (
            state.metadata.name === undefined ||
            state.metadata.name === null
          ) {
            throw new GraphError(
              'Token name is used, but not defined in the inputs.',
              node.id,
              {
                type: 'output',
                id: node.outputs.name.id,
              },
              {
                type: 'metadata',
                key: 'name',
              },
            )
          }
          return { type: 'string', list: false, value: state.metadata.name }
        },
        description: ({ node, state }) => {
          if (
            state.metadata.description === undefined ||
            state.metadata.description === null
          ) {
            throw new GraphError(
              'Token description is used, so it needs to be defined',
              node.id,
              {
                type: 'output',
                id: node.outputs.description.id,
              },
              {
                type: 'metadata',
                key: 'description',
              },
            )
          }
          return {
            type: 'string',
            list: false,
            value: state.metadata.description,
          }
        },
      },
    },
  },
  'enum-input': {
    simulate: {
      outputs: {
        output: ({ node, controls }) => {
          if (!controls?.output?.value) {
            throw new GraphError('Control not found', node.id)
          }
          return {
            type: 'enum',
            list: false,
            value: controls?.output?.value as string,
          }
        },
      },
    },
  },
  'number-input': {
    simulate: {
      outputs: {
        output: ({ controls }) => {
          return {
            type: 'number',
            list: false,
            value: controls?.number.value as number,
          }
        },
      },
    },
  },
  'text-input': {
    simulate: {
      outputs: {
        output: (data) => {
          return {
            type: 'string',
            list: false,
            value: (data.controls?.text.value as string) || '',
          }
        },
      },
    },
  },
  'boolean-input': {
    simulate: {
      outputs: {
        output: ({ controls }) => {
          return {
            type: 'boolean',
            list: false,
            value: !!controls?.boolean.value as boolean,
          }
        },
      },
    },
  },
  'address-input': {
    simulate: {
      outputs: {
        output: ({ controls }) => {
          return {
            type: 'address',
            list: false,
            value: controls?.address.value as string,
          }
        },
      },
    },
  },
  'color-input': {
    simulate: {
      outputs: {
        output: ({ controls }) => {
          return {
            type: 'color',
            list: false,
            value: controls?.color.value as Color,
          }
        },
      },
    },
  },
  'datetime-input': {
    simulate: {
      outputs: {
        output: ({ controls }) => {
          return {
            type: 'datetime',
            list: false,
            value: controls?.datetime.value as number,
          }
        },
      },
    },
  },
  'location-input': {
    simulate: {
      outputs: {
        output: ({ controls }) => {
          return {
            type: 'location',
            list: false,
            value: controls?.location.value as Location,
          }
        },
      },
    },
  },
  'weather-input': {
    simulate: {
      outputs: {
        output: ({ controls }) => {
          return {
            type: 'weather',
            list: false,
            value: controls?.weather.value as WeatherCode,
          }
        },
      },
    },
  },
  'direction-input': {
    simulate: {
      outputs: {
        output: ({ controls }) => {
          return {
            type: 'direction',
            list: false,
            value: controls?.direction.value as Direction,
          }
        },
      },
    },
  },
  'data-switch': {
    simulate: {
      outputs: {
        output: ({ inputs }) => {
          const switchValue = inputs?.switch?.value as boolean
          if (switchValue) {
            return inputs?.true
          }
          return inputs?.false
        },
      },
    },
  },
  'map-to-number': {
    simulate: {
      outputs: {
        output: ({ controls, inputs }) => {
          const steps = controls?.breakpoints.value as number[]
          const breakpoints = steps.sort((a, b) => a - b)
          const mode = controls?.mode.value as 'up' | 'down'
          const number = inputs?.number.value as number
          let index = breakpoints.findIndex((b) => {
            return b >= number
          })
          if (index === -1) {
            index = breakpoints.length
          } else {
            if (breakpoints[index] === number && mode === 'up') {
              index = index + 1
            }
          }
          return inputs?.[`${index}`]
        },
      },
    },
  },
  'map-to-date': {
    simulate: {
      outputs: {
        output: ({ controls, inputs, node }) => {
          const steps = controls?.breakpoints.value as number[]
          const breakpoints = steps.sort((a, b) => a - b)
          const mode = controls?.mode.value as 'up' | 'down'
          const datetime = inputs?.datetime.value as number

          let index = breakpoints.findIndex((b) => {
            return b >= datetime
          })
          if (index === -1) {
            index = breakpoints.length
          } else {
            if (breakpoints[index] === datetime && mode === 'up') {
              index = index + 1
            }
          }
          return inputs?.[`${index}`]
        },
      },
    },
  },
  'map-to-choice': {
    simulate: {
      outputs: {
        output: ({ inputs }) => {
          const value = inputs?.value.value as string
          return inputs?.[value]
        },
      },
    },
  },
}
