'use client'

import { Card, CardContent } from '@repo/ui/components/ui/card'
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@repo/ui/components/ui/carousel'
import { cn } from '@repo/ui/lib/utils'
import React from 'react'

const tiers = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
  },
  {
    id: 'creator',
    name: 'Creator',
    price: 19,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 49,
  },
]

export function Pricing() {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)

  React.useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])
  return (
    <>
      <div className="w-full space-y-3 md:hidden">
        <Carousel setApi={setApi} className="w-full overflow-visible md:hidden">
          <CarouselContent>
            {tiers.map((tier, index) => (
              <CarouselItem key={tier.id}>
                <div className="p-1">
                  <TierCard tier={tier} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <div className="flex w-full items-center justify-center gap-2">
          {tiers.map((tier, index) => (
            <div
              key={`dot-${tier.id}`}
              className={cn(
                'size-2 rounded-full border border-border bg-muted',
                current === index + 1 &&
                  'border-muted-foreground bg-muted-foreground',
              )}
            />
          ))}
        </div>
      </div>
      <div className="mx-auto grid -md:hidden w-full max-w-5xl grid-cols-3 gap-4">
        {tiers.map((tier) => (
          <TierCard key={tier.id} tier={tier} />
        ))}
      </div>
    </>
  )
}

function TierCard({ tier }: { tier: (typeof tiers)[number] }) {
  return (
    <Card className="h-96 !rounded-home_mobile lg:!rounded-home">
      <CardContent className="h-full flex items-center justify-center p-6">
        <span className="text-muted-foreground">{tier.name}</span>
      </CardContent>
    </Card>
  )
}
