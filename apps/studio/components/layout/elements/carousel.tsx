'use client'

import {
  Carousel as CarouselComponent,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
} from '@repo/ui/components/ui/carousel'
import { type ReactNode, useEffect, useState } from 'react'
import { useMediaQuery } from '@/lib/hooks/media-query'
import { cn } from '@repo/ui/lib/utils'
import { PiSwipeRightHandStroke } from '@repo/ui/icons/pika'

export default function Carousel({
  elements,
}: { elements: { component: ReactNode; key: string }[] }) {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)
  const [swiped, setSwiped] = useState(false)
  const md = useMediaQuery('(min-width: 768px)')
  const lg = useMediaQuery('(min-width: 1024px)')
  const xll = useMediaQuery('(min-width: 1400px)')

  useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1)
      setSwiped(true)
    })
  }, [api])
  const hasNext =
    (!lg && count > 1) || (lg && !xll && count > 2) || (xll && count > 3)
  return (
    <div className={cn('w-full space-y-3 md:pr-10')}>
      <CarouselComponent
        setApi={setApi}
        opts={{
          align: 'start',
        }}
      >
        <CarouselContent>
          {elements.map((element, index) => (
            <CarouselItem
              key={element.key}
              className=" lg:basis-1/2  2xl:basis-1/3"
            >
              {element.component}
            </CarouselItem>
          ))}
        </CarouselContent>
        {hasNext && <CarouselNext className="hidden md:flex" />}
      </CarouselComponent>
      {!swiped && hasNext && (
        <p className="flex w-full items-center justify-center gap-2 text-sm text-muted-foreground md:hidden">
          <PiSwipeRightHandStroke className="size-3.5" />
          Swipe to see more
        </p>
      )}
    </div>
  )
}
