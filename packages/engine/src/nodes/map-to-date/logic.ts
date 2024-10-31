import type { NodeLogic } from '@repo/engine/types/node-types'
import type { MapToDateNode } from '@repo/engine/nodes/map-to-date/interface'

export const mapToDateLogic: NodeLogic<MapToDateNode> = {
  data: {
    output: async ({ getInputValue, getControlValue }) => {
      const steps = getControlValue('breakpoints').value
      const breakpoints = steps.sort((a, b) => a - b)
      const mode = getControlValue('mode').value
      const datetime = await getInputValue('datetime')

      let index = breakpoints.findIndex((b) => {
        return b >= datetime.value
      })
      if (index === -1) {
        index = breakpoints.length
      } else {
        if (breakpoints[index] === datetime.value && mode === 'up') {
          index = index + 1
        }
      }
      const outputKey = `${index}`
      return getInputValue(outputKey)
    },
  },
}
