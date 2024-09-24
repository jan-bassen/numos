import type { Direction } from '@/types/database.types'
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
  type LucideIcon,
} from 'lucide-react'

export const directionKeys = [
  'left',
  'right',
  'top',
  'bottom',
  'center',
  'top-right',
  'bottom-right',
  'bottom-left',
  'top-left',
] as const

export const directions: Record<
  Direction,
  { title: string; Icon: LucideIcon }
> = {
  'top-left': { title: 'Top Left', Icon: ArrowUpLeft },
  top: { title: 'Top', Icon: ArrowUp },
  'top-right': { title: 'Top Right', Icon: ArrowUpRight },
  left: { title: 'Left', Icon: ArrowLeft },
  center: { title: 'Center', Icon: Dot },
  right: { title: 'Right', Icon: ArrowRight },
  'bottom-left': { title: 'Bottom Left', Icon: ArrowDownLeft },
  bottom: { title: 'Bottom', Icon: ArrowDown },
  'bottom-right': { title: 'Bottom Right', Icon: ArrowDownRight },
}
