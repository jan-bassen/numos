'use client'

export function LogicGraphic() {
  const point1 = { x: 0, y: 0 }
  const point2 = { x: 86, y: 40 }

  const vertical = Math.abs(point1.y - point2.y)
  const hx1 =
    point1.x + Math.max(vertical / 2, Math.abs(point2.x - point1.x)) * 0.55
  const hx2 =
    point2.x - Math.max(vertical / 2, Math.abs(point2.x - point1.x)) * 0.55

  const path1 = `M ${point1.x} ${point1.y} C ${hx1} ${point1.y} ${hx2} ${point2.y} ${point2.x} ${point2.y}`

  return (
    <div className="relative h-full w-11/12 overflow-hidden rounded-tr-[2rem] border-border -md:border-t border-r bg-muted/20 p-2 shadow-inner md:h-[90%] md:w-5/6 md:rounded-br-[2rem] md:border-b">
      <div className="h-full w-full rounded-tr-[2rem] bg-[50px_50px] bg-[length:100px_100px] bg-dots_grid opacity-40 md:rounded-br-[2rem]" />
      <div className="-left-5 absolute top-10 h-20 w-40 rounded-lg bg-gradient-to-t from-muted to-background shadow-md ring-2 ring-muted-foreground/30 md:left-10">
        <div className="-right-1.5 absolute top-8 z-10 size-3 rounded-lg bg-creative shadow-md ring-2 ring-creative/30" />
      </div>
      <svg
        data-testid="connection"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute top-[4.9rem] left-[8.75rem] h-[43px] w-[86px] stroke-2 stroke-creative md:left-[12.5rem]"
      >
        <title>connection</title>
        <path fill="none" strokeWidth={2} d={path1} />
        {/* <circle cx={adjStart.x} cy={adjStart.y} r="1" stroke="black" stroke-width="0" fill="red" className="z-40" z={100} /> 
                 <circle cx={adjEnd.x} cy={adjEnd.y} r="1" stroke="black" stroke-width="0" fill="red" className="z-40" z={100} /> */}
      </svg>
      <div className="absolute top-20 left-[14.25rem] h-20 w-40 rounded-lg bg-gradient-to-t from-muted to-background shadow-md ring-2 ring-muted-foreground/30 md:left-72">
        <div className="-left-1.5 absolute top-8 z-10 size-3 rounded-lg bg-creative shadow-md ring-2 ring-creative/30" />
      </div>
    </div>
  )
}
