import { cn } from '@/lib/utils'
import type { SocketType } from '@/types/database.types'
import { type Position, Presets } from 'rete-react-plugin'

const { useConnection } = Presets.classic

function classicConnectionPath(
  points: [Position, Position],
  curvature: number,
) {
  const [{ x: x1, y: y1 }, { x: x2, y: y2 }] = points
  const vertical = Math.abs(y1 - y2)
  const hx1 = x1 + Math.max(vertical / 2, Math.abs(x2 - x1)) * curvature
  const hx2 = x2 - Math.max(vertical / 2, Math.abs(x2 - x1)) * curvature

  return `M ${x1} ${y1} C ${hx1} ${y1} ${hx2} ${y2} ${x2} ${y2}`
}

export function getConnection(type?: SocketType) {
  return function ConnectionComponent(props: { data: Node }) {
    const { start, end } = useConnection()
    if (!start || !end) return null
    const adjStart = {
      x: start.x - 6 + (type && type === 'exec' ? 5 : 0),
      y: start.y,
    }
    const adjEnd = { x: end.x + 6, y: end.y }
    const path = classicConnectionPath([adjStart, adjEnd], 0.55)
    return (
      <svg
        data-testid="connection"
        xmlns="http://www.w3.org/2000/svg"
        className="!overflow-visible pointer-events-none absolute size-[9999px]"
      >
        <title>connection</title>
        <path
          fill="none"
          strokeDasharray={type === 'exec' ? '4 2' : undefined}
          strokeWidth={2}
          className={cn(
            'pointer-events-auto stroke-2',
            type ? `stroke-${type}` : 'stroke-number',
            type === 'exec' && 'motion-safe:animate-path',
          )}
          d={path}
        />
        {/* <circle cx={adjStart.x} cy={adjStart.y} r="1" stroke="black" stroke-width="0" fill="red" className="z-40" z={100} /> 
                 <circle cx={adjEnd.x} cy={adjEnd.y} r="1" stroke="black" stroke-width="0" fill="red" className="z-40" z={100} /> */}
      </svg>
    )
  }
}
