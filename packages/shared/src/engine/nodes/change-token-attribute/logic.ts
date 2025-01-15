import type { NodeLogic } from '@repo/shared/types/node-types'
import type { ChangeTokenAttributeNode } from '@repo/shared/engine/nodes/change-token-attribute/interface'
import { NodeError } from '@repo/shared/errors/node-error'
import { Decimal } from 'decimal.js'
import { valueToText } from '@repo/shared/schemas/datatypes/utils'

export const changeTokenAttributeLogic: NodeLogic<ChangeTokenAttributeNode> = {
  execution: async ({
    getControlValue,
    getInputValue,
    getTokenAttribute,
    setTokenAttribute,
  }) => {
    const attributeId = getControlValue('attribute').value

    const value = await getInputValue('value')
    const oldValue = await getTokenAttribute(attributeId)

    let mode: 'set' | 'incr' | 'decr' = 'set'

    if (oldValue.type === 'number' && value.type === 'number') {
      mode = getControlValue('mode').value as 'set' | 'incr' | 'decr'
    }

    if (mode === 'set') {
      const { changed, previous } = await setTokenAttribute(attributeId, value)
      const message = changed
        ? `Set Attribute to ${valueToText(value)}`
        : `Attribute already set to ${valueToText(previous)}`
      return { forward: 'exec', log: { message } }
    }

    const errorLocation = {
      component: {
        key: 'value',
        type: 'input' as const,
      },
      input: {
        key: attributeId,
        type: 'attributes' as const,
      },
    }

    if (oldValue.type !== 'number' || value.type !== 'number') {
      throw new NodeError(
        "Attribute or value is not a number, can't be set to increase/decrease mode",
        errorLocation,
      )
    }
    if (oldValue.format !== 'single' || value.format !== 'single') {
      throw new NodeError(
        "Attribute is a list, so it can't be set to increase/decrease mode",
        errorLocation,
      )
    }

    const a = new Decimal(oldValue.value)
    const b = new Decimal(value.value)

    let newValue: Decimal

    switch (mode) {
      case 'incr':
        newValue = a.add(b)
        break
      case 'decr':
        newValue = a.sub(b)
        break
      default:
        throw new NodeError(`Mode ${mode} is not supported`, errorLocation)
    }

    const { changed } = await setTokenAttribute(attributeId, {
      type: 'number',
      format: 'single',
      value: newValue.toNumber(),
    })

    const message = changed
      ? `${attributeId} ${mode === 'incr' ? 'increased' : 'decreased'} by ${value.value} to ${newValue.toNumber()}`
      : `${attributeId} already set to ${oldValue.value}`

    return {
      forward: 'exec',
      log: { message: 'Attempting an attribute change' },
    }
  },
}
