import type { NodeLogic } from '@repo/engine/types/node-types.ts'
import type { MapToDateNode } from './interface.ts'

export const mapToDateLogic: NodeLogic<MapToDateNode> = {
  data: {
    output: ({ getInputValue, getControlValue }) => {
      const steps = getControlValue('breakpoints').value
      const breakpoints = steps.sort((a, b) => a - b)
      const mode = getControlValue('mode').value
      const datetime = getInputValue('datetime').value

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
      const outputKey = `${index}`
      return getInputValue(outputKey)
    },
  },
}
