import {
  restrictToHorizontalAxis,
  restrictToVerticalAxis,
} from '@dnd-kit/modifiers'

import { restrictToParentElement } from '@dnd-kit/modifiers'

export function getModifiers(limitAxis?: 'x' | 'y') {
  const modifiers = [restrictToParentElement]
  if (limitAxis === 'x') {
    modifiers.push(restrictToHorizontalAxis)
  } else if (limitAxis === 'y') {
    modifiers.push(restrictToVerticalAxis)
  }
  return modifiers
}
