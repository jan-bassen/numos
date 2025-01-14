import type { JSX } from 'react'

// biome-ignore lint/complexity/noBannedTypes: <explanation>
export type ConstantInfo<T extends string = string, E extends {} = {}> = {
  value: T
  id?: string
  label?: string
  subtext?: string
  description?: string
  icons?: {
    stroke: (props: JSX.IntrinsicElements['svg']) => JSX.Element
    fill: (props: JSX.IntrinsicElements['svg']) => JSX.Element
  }
} & E

// biome-ignore lint/complexity/noBannedTypes: <explanation>
export type Constant<T extends string, E extends {} = {}> = Record<
  T,
  ConstantInfo<T, E>
>
