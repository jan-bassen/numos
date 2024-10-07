import type { NodeLogic } from '@repo/engine/types/node-types.ts'
import type { MapToNumberNode } from './interface.ts'

export const mapToNumberLogic: NodeLogic<MapToNumberNode> = {
  data: {
    output: ({ getInputValue, getControlValue }) => {
      const steps = getControlValue('breakpoints').value
      const breakpoints = steps.sort((a, b) => a - b)
      const mode = getControlValue('mode').value
      const number = getInputValue('number').value
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
      const outputKey = `${index}`
      return getInputValue(outputKey)
    },
  },
}
