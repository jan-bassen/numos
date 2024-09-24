import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

export default function CardRow({
  cards,
  createButton,
  className,
}: {
  cards: { component: ReactNode; key: string }[]
  createButton?: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'grid min-h-0 min-w-0 grid-cols-1 gap-3 overflow-hidden md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4',
        className,
      )}
    >
      {cards.map((card, i) => {
        return (
          <div key={card.key} className={cn('h-fit w-full')}>
            {card.component}
          </div>
        )
      })}
      {createButton}
    </div>
  )
}
