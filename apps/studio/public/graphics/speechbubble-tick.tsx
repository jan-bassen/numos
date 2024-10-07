import { cn } from '@repo/ui/lib/utils'

export default function SpeechbubbleTick({
  className,
  pathClassName,
  rectClassName,
}: {
  className?: string
  pathClassName?: string
  rectClassName?: string
}) {
  return (
    <svg
      viewBox="0 0 24 12"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      xmlSpace="preserve"
      className={cn(className)}
    >
      <g transform="matrix(-0.0981346,-1.2018e-17,9.45106e-18,-0.0771738,60.2369,48.1547)">
        <path
          d="M379.385,617.538L491.538,474.923L603.692,617.538"
          className={cn(className)}
        />
      </g>
      <rect x="0" y="0" width="24" height="1" className={cn(rectClassName)} />
    </svg>
  )
}
