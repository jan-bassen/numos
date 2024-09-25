import { GraphError } from '../errors'
import type { HybridNodeLogic } from '../types'

// Validate input data in each node

export const actionNodeLogic: HybridNodeLogic = {
  type: 'hybrid',
  execution: ({ execution }) => {
    return {
      execution,
      forward: 'exec',
      log: { message: 'Action started' },
    }
  },
  data: (key, { data, context }) => {
    const parameter = data.parameters[key]
    if (
      !parameter ||
      parameter.value === undefined ||
      parameter.value === null
    ) {
      throw new GraphError('Parameter is used, so it needs to be defined', {
        node: context.nodeId,
        component: {
          key: key,
          type: 'output',
        },
        input: {
          key: key,
          type: 'parameters',
        },
      })
    }
    return parameter
  },
}
