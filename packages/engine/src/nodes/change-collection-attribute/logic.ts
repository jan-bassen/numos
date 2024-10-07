import type { NodeLogic } from '@repo/engine/types/node-types.ts'
import type { ChangeCollectionAttributeNode } from './interface.ts'
import { NodeError } from '@repo/engine/errors/node-error.ts'
import { Decimal } from 'decimal.js'

export const changeCollectionLogic: NodeLogic<ChangeCollectionAttributeNode> = {
  execution: ({
    getControlValue,
    getInputValue,
    getCollectionAttribute,
    setCollectionAttribute,
  }) => {
    const attributeKey = getControlValue('attribute')
    const mode = getControlValue('mode')
    const value = getInputValue('value')

    if (mode.value === 'set') {
      const { changed, previous } = setCollectionAttribute(
        attributeKey.value,
        value,
      )
      const message = changed
        ? `Set ${attributeKey.value} to ${value.value}`
        : `${attributeKey.value} already set to ${previous}`
      return { forward: 'exec', log: { message } }
    }

    const oldValue = getCollectionAttribute(attributeKey.value)

    const errorLocation = {
      component: {
        key: 'value',
        type: 'input' as const,
      },
      input: {
        key: attributeKey.value,
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

    switch (mode.value) {
      case 'incr':
        newValue = a.add(b)
        break
      case 'decr':
        newValue = a.sub(b)
        break
      default:
        throw new NodeError(
          `Mode ${mode.value} is not supported`,
          errorLocation,
        )
    }

    const { changed } = setCollectionAttribute(attributeKey.value, {
      type: 'number',
      format: 'single',
      value: newValue.toNumber(),
    })

    const message = changed
      ? `${attributeKey.value} ${mode.value === 'incr' ? 'increased' : 'decreased'} by ${value.value} to ${newValue.toNumber()}`
      : `${attributeKey.value} already set to ${oldValue.value}`

    return { forward: 'exec', log: { message } }
  },
}
