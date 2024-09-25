import {
  validate,
  type ExecutionNodeLogic,
  type HybridNodeLogic,
} from '../types'

export const actionRootLogic: HybridNodeLogic = {
  type: 'hybrid',
  execution: () => {
    return { forward: 'exec', log: { message: 'Action started' } }
  },
  data(key, { getParameter }) {
    const parameter = getParameter(key)
    return parameter
  },
}

export const changeTokenName: ExecutionNodeLogic = {
  type: 'execution',
  execution: async ({ getMetadata, getInputValue, setMetadata }) => {
    const oldName = getMetadata('name')
    const nameInput = getInputValue('name')

    // Find a good pattern for validation
    const newName = validate('string', nameInput)

    // Really return changed or check beforehand?
    const changed = setMetadata('name', newName)
    const message = changed
      ? `Token name changed from ${oldName} to ${newName}`
      : `Token name unchanged at ${oldName}`

    // Handle single forward implicitly???
    return {
      forward: 'exec',
      log: { message },
    }
  },
}
