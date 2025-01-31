import * as React from 'react'
import { breakpoints } from './media-query'

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoints.md - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < breakpoints.md)
    }
    mql.addEventListener('change', onChange)
    setIsMobile(window.innerWidth < breakpoints.md)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  return !!isMobile
}
