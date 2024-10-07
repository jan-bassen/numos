import { cn } from '@repo/ui/lib/utils'
import type { ReactNode } from 'react'

export default function Explainer({
  side,
  title,
  description,
  box,
}: {
  side: 'left' | 'right'
  title: string
  description: string
  box: ReactNode
}) {
  return (
    <div className="flex min-h-40 flex-col gap-4">
      <div className="flex flex-col items-center gap-6 lg:grid lg:grid-cols-9 lg:gap-14">
        <div
          className={cn(
            'col-span-4 w-[calc(100%+4rem)] overflow-hidden md:w-full md:overflow-visible',
            side !== 'left' && 'lg:hidden',
          )}
        >
          {box}
        </div>
        <div className="col-span-5 flex flex-col gap-4">
          <h2 className="text-balance text-center font-extrabold text-[2.5rem] leading-[1.05] md:text-[2.8rem] md:leading-[1.15] lg:text-left">
            {title}
          </h2>
          <p className="max-w-[40rem] pl-0.5 text-center text-muted-foreground lg:max-w-none lg:text-left">
            {description}
          </p>
        </div>
        {side === 'right' && (
          <div className="col-span-4 hidden w-full lg:block">{box}</div>
        )}
      </div>
    </div>
  )
}
