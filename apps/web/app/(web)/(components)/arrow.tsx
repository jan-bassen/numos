import { cn } from '@repo/ui/lib/utils'
import type { ComponentProps } from 'react'

export function Arrow({ className, ...props }: ComponentProps<'svg'>) {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 200 200"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      xmlSpace="preserve"
      className={cn(className)}
      style={{
        fillRule: 'evenodd',
        clipRule: 'evenodd',
        strokeLinejoin: 'round',
        strokeMiterlimit: 2,
      }}
      {...props}
    >
      <title>Decorative arrow</title>
      <rect x="0" y="0" width="200" height="200" style={{ fill: 'none' }} />
      <path
        fill="currentColor"
        d="M117.131,165.978c-42.645,-2.486 -66.101,-15.178 -77.944,-34.164c-7.287,-11.683 -10.317,-26.013 -10.185,-42.643c0.181,-22.805 6.345,-50.256 14.006,-80.947c1.136,-4.552 5.753,-7.325 10.305,-6.188c4.552,1.136 7.325,5.753 6.189,10.305c-6.106,24.46 -11.315,46.751 -12.97,66.126c-1.508,17.659 -0.179,32.713 7.08,44.35c9.536,15.288 28.981,23.886 62.833,26.086c-2.935,-7.888 -15.39,-30.801 -15.39,-30.801l81.434,37.022l-78.662,43.095l13.304,-32.241Z"
      />
    </svg>
  )
}
