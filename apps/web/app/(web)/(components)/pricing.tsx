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
import {
  PiCheckTickCircleStroke,
  PiCrossCross,
  PiMultipleCrossCancelCircleStroke,
  PiStopCircleContrast,
} from '@repo/ui/icons/pika'
import { cn } from '@repo/ui/lib/utils'
import React from 'react'

const tiers = [
  {
    id: 'free',
    name: 'Free',
    subtitle: 'Try out the studio, no extra steps required',
    price: 0,
    features: ['Basic Studio access', 'No time limit'],
  },
  {
    id: 'creator',
    name: 'Creator',
    subtitle: 'Perfect for artists, creators, and small teams',
    price: 19,
    features: [
      'Advanced Studio access',
      '200 Tokens included',
      '5000 interactions included',
      'Email support',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    subtitle: 'Designed for professional teams and studios',
    price: 49,
    features: [
      'Full Studio access',
      '500 Tokens included',
      '$0.02/ add. token',
      '5000 interactions per day included',
      '$0.00005/ add. interaction',
      'Personal support calls',
    ],
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
    <Card className="!rounded-home_mobile lg:!rounded-home min-h-[26rem] bg-gradient-to-b from-background to-muted/30">
      <CardContent className="h-full space-y-5 p-6">
        <div className="space-y-1">
          <h2 className="font-bold text-xl">{tier.name}</h2>
          <p className="min-h-11 text-muted-foreground text-sm">
            {tier.subtitle}
          </p>
          <div className="flex items-end gap-1 pt-2">
            <p className="font-medium text-4xl">${tier.price}</p>
            <p className="pb-0.5 text-muted-foreground text-sm">/month</p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {tier.features.map((feature) => (
            <div key={feature} className="flex items-center gap-2">
              <PiCheckTickCircleStroke className="size-4 shrink-0" />
              <p className="text-sm">{feature}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
