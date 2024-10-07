import {
  ExecNodeDefinitions,
  type NodeLogicDefinitions,
} from '@/types/nodes.types'
import { GraphError } from '@/lib/errors'
import type { ActionNodeType } from '../definitions/action-nodes'
import {
  type NotatedDataTypeValue,
  NotatedDataTypeValueMap,
  type OptionalTokenState,
  TokenState,
} from '@/types/database.types'
import { datatypeToText } from '@/components/datatypes/utils'
import Decimal from 'decimal.js'
import { getSchemaFromAttribute } from '@/components/elements/attributes/attribute-schema'
import { validateValueType } from '@/components/datatypes/schemas'
import { toast } from 'sonner'

export const actionNodesLogic: NodeLogicDefinitions<ActionNodeType> = {
  'action-root': {
    simulate: {
      execution: ({ state }) => {
        return { state, forward: 'exec', log: 'Action started' }
      },
      outputs(key, data) {
        const parameter = data.context.parameters?.[key]
        if (
          !parameter ||
          parameter.value === undefined ||
          parameter.value === null
        ) {
          throw new GraphError(
            'Parameter is used, so it needs to be defined',
            data.node.id,
            {
              type: 'output',
              id: key,
            },
            {
              type: 'parameters',
              key: key,
            },
          )
        }
        return parameter
      },
    },
  },
  'change-attribute': {
    simulate: {
      execution: async ({ controls, node, inputs, state, context }) => {
        const attribute = controls.attribute.value as string
        if (
          state.attributes[attribute] === undefined ||
          state.attributes[attribute] === null
        ) {
          throw new GraphError(
            `Attribute ${attribute} is not defined`,
            node.id,
            undefined,
            {
              type: 'attributes',
              key: attribute,
            },
          )
        }
        const _attribute = context.attributes.find((a) => a.slug === attribute)
        if (!_attribute) {
          throw new GraphError(
            `Attribute with slug ${attribute} not found in attributes`,
            node.id,
            { type: 'control', id: node.controls.attribute.key },
          )
        }
        const schema = getSchemaFromAttribute(_attribute, {
          optional: false,
          inForm: false,
        })

        const { result: oldAttribute, error } = validateValueType(
          state.attributes[attribute].type,
          state.attributes[attribute].list,
          state.attributes[attribute].value,
          { optional: false, asObjectArray: false },
        )
        if (error) {
          throw new GraphError('Error with parsing value', node.id, {
            type: 'control',
            id: node.controls.attribute.key,
          })
        }

        let changeMode = 'changed'
        const isSetTo =
          controls.mode?.value === 'set' ||
          state.attributes[attribute].type !== 'number'

        let newAttribute: NotatedDataTypeValue
        if (isSetTo) {
          const { result, error } = validateValueType(
            state.attributes[attribute].type,
            state.attributes[attribute].list,
            inputs.value.value,
            { optional: false, asObjectArray: false },
          )
          if (error) {
            throw new GraphError('Error with parsing value', node.id, {
              type: 'control',
              id: node.controls.mode.key,
            })
          }
          newAttribute = result
        } else {
          const mode = controls.mode.value as 'incr' | 'decr'
          if (!mode || !['incr', 'decr'].includes(mode)) {
            throw new GraphError('Issue with mode', node.id, {
              type: 'control',
              id: node.controls.mode.key,
            })
          }
          if (mode === 'incr') {
            changeMode = 'increased'
          } else if (mode === 'decr') {
            changeMode = 'decreased'
          }
          const a = new Decimal(state.attributes[attribute].value as number)
          switch (controls.mode.value) {
            case 'decr': {
              const { result, error } = validateValueType(
                state.attributes[attribute].type,
                state.attributes[attribute].list,
                a.sub(inputs.value.value as number).toNumber(),
                { optional: false, asObjectArray: false },
              )
              if (error) {
                throw new GraphError('Error with parsing value', node.id, {
                  type: 'control',
                  id: node.controls.mode.key,
                })
              }
              newAttribute = result
              break
            }
            case 'incr': {
              const { result, error } = validateValueType(
                state.attributes[attribute].type,
                state.attributes[attribute].list,
                a.add(inputs.value.value as number).toNumber(),
              )
              if (error) {
                throw new GraphError('Error with parsing value', node.id, {
                  type: 'control',
                  id: node.controls.mode.key,
                })
              }
              newAttribute = result
              break
            }
            default: {
              throw new GraphError(
                `Invalid mode ${controls.mode.value}`,
                node.id,
                { type: 'control', id: node.controls.mode.key },
              )
            }
          }
        }

        try {
          schema.parse(newAttribute.value)
        } catch (e) {
          throw new GraphError(
            `Invalid value ${newAttribute.value} for attribute ${attribute}`,
            node.id,
            { type: 'control', id: node.controls.attribute.key },
          )
        }

        const newState: OptionalTokenState = {
          ...state,
          attributes: {
            ...state.attributes,
            [attribute]: newAttribute,
          },
        }

        const log =
          state.attributes[attribute].value !== newAttribute.value
            ? `Attribute ${attribute} ${changeMode} from ${datatypeToText(oldAttribute, false)} to ${datatypeToText(newAttribute, false)}`
            : `Attribute ${attribute} unchanged at ${state.attributes[attribute].value}`

        return {
          state: newState,
          forward: 'exec',
          log,
        }
      },
    },
  },
  'change-token-name': {
    simulate: {
      execution: async ({ controls, inputs, state, context }) => {
        const name = inputs.name.value as string
        const newState: OptionalTokenState = {
          ...state,
          metadata: {
            ...state.metadata,
            name: name,
          },
        }
        const log =
          name !== state.metadata.name && name
            ? `Token name changed from ${state.metadata.name} to ${name}`
            : `Token name unchanged at ${state.metadata.name}`

        return {
          state: newState,
          forward: 'exec',
          log,
        }
      },
    },
  },
  'change-token-description': {
    simulate: {
      execution: async ({ controls, inputs, state, context }) => {
        const description = inputs.description.value as string
        const newState: OptionalTokenState = {
          ...state,
          metadata: {
            ...state.metadata,
            description: description,
          },
        }
        const log =
          description !== state.metadata.description && description
            ? `Token description changed from ${state.metadata.description} to ${description}`
            : `Token description unchanged at ${state.metadata.description}`

        return {
          state: newState,
          forward: 'exec',
          log,
        }
      },
    },
  },
  switch: {
    simulate: {
      execution: ({ inputs, state }) => {
        const switchValue = inputs.switch.value as boolean
        return {
          state,
          forward: switchValue ? 'true' : 'false',
          log: `Switch executed with value ${switchValue}`,
        }
      },
    },
  },
  log: {
    simulate: {
      execution: ({ inputs, state }) => {
        const text = datatypeToText(inputs.value, false)
        if (text === 'undefined' || typeof text !== 'string')
          return {
            state,
            forward: 'exec',
            log: 'Recieved invalid data to log',
          }
        return { state, forward: 'exec', log: text }
      },
    },
  },
  stop: {
    simulate: {
      execution: ({ state }) => {
        return {
          state,
          log: 'Action explicitly stopped',
        }
      },
    },
  },
  cancel: {
    simulate: {
      execution: ({ initialState }) => {
        return {
          state: initialState,
          log: 'Action canceled and reverted to initial state',
        }
      },
    },
  },
}
