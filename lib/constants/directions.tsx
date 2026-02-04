import type { Direction } from '@/types/database.types'
import type { SelectOption } from '@/types/nodes.types'
import { lucideToJSX } from '@repo/ui/lib/utils'

import {
  ArrowDown,
  ArrowDownLeft,
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowUpLeft,
  ArrowUpRight,
  Dot,
} from 'lucide-react'

export const directions: Record<Direction, SelectOption> = {
  'top-left': {
    value: 'top-left',
    label: 'Top Left',
    icons: { stroke: lucideToJSX(ArrowUpLeft) },
  },
  top: { value: 'top', label: 'Top', icons: { stroke: lucideToJSX(ArrowUp) } },
  'top-right': {
    value: 'top-right',
    label: 'Top Right',
    icons: { stroke: lucideToJSX(ArrowUpRight) },
  },
  left: {
    value: 'left',
    label: 'Left',
    icons: { stroke: lucideToJSX(ArrowLeft) },
  },
  center: {
    value: 'center',
    label: 'Center',
    icons: { stroke: lucideToJSX(Dot) },
  },
  right: {
    value: 'right',
    label: 'Right',
    icons: { stroke: lucideToJSX(ArrowRight) },
  },
  'bottom-left': {
    value: 'bottom-left',
    label: 'Bottom Left',
    icons: { stroke: lucideToJSX(ArrowDownLeft) },
  },
  bottom: {
    value: 'bottom',
    label: 'Bottom',
    icons: { stroke: lucideToJSX(ArrowDown) },
  },
  'bottom-right': {
    value: 'bottom-right',
    label: 'Bottom Right',
    icons: { stroke: lucideToJSX(ArrowDownRight) },
  },
}
