import type { NodeLogic } from '@repo/engine/types/node-types'
import type { MapToNumberNode } from '@repo/engine/nodes/map-to-number/interface'

export const mapToNumberLogic: NodeLogic<MapToNumberNode> = {
  data: {
    output: async ({ getInputValue, getControlValue }) => {
      const steps = getControlValue('breakpoints').value
      const breakpoints = steps.sort((a, b) => a - b)
      const mode = getControlValue('mode').value
      const number = await getInputValue('number')
      let index = breakpoints.findIndex((b) => {
        return b >= number.value
      })
      if (index === -1) {
        index = breakpoints.length
      } else {
        if (breakpoints[index] === number.value && mode === 'up') {
          index = index + 1
        }
      }
      const outputKey = `${index}`
      return getInputValue(outputKey)
    },
  },
}
