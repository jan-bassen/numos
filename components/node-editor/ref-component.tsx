import * as React from 'react'
import { useEffect } from 'react'

type RefUpdate = (ref: HTMLElement) => void
type BaseProps = { init: RefUpdate; unmount: RefUpdate } & Record<
  string,
  unknown
>

/**
 * Component for rendering various elements embedded in the React.js component tree.
 */
export function RefComponent<Props extends BaseProps>({
  init,
  unmount,
  ...props
}: Props) {
  const ref = React.useRef<HTMLSpanElement>(null)

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const element = ref.current

    return () => {
      if (element) unmount(element)
    }
  }, [])
  useEffect(() => {
    if (ref.current) init(ref.current)
  })

  return <span {...props} ref={ref} />
}
