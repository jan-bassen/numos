'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Button } from '@repo/ui/components/ui/button'
import { Droplets, FlaskConical, RefreshCcw } from 'lucide-react'
import Fireworks from 'react-canvas-confetti/dist/presets/fireworks'
import { HomeDescription, HomeHeading } from './heading'
import type { Dictionary } from '@/dictionaries/dictionaries'

export function Example({
  dictionary,
}: {
  dictionary: Dictionary['home']['example']
}) {
  const [confetti, setConfetti] = useState(false)
  const [size, setSize] = useState(1)
  const [health, setHealth] = useState(4)
  const [lastAction, setLastAction] = useState<'water' | 'fertilize' | null>(
    null,
  )

  useEffect(() => {
    if (size === 4 && health === 4) {
      shootConfetti()
    }
  }, [size, health])

  const water = () => {
    if (size < 4 && lastAction !== 'water') {
      setSize(size + 1)
    }

    if (health > 1) {
      setHealth(health - 1)
    }
    setLastAction('water')
  }

  const fertilize = () => {
    if (health < 4 && lastAction !== 'fertilize') {
      setHealth(health + 1)
    } else if (health > 1 && lastAction === 'fertilize') {
      setHealth(health - 1)
    }
    setLastAction('fertilize')
  }

  const shootConfetti = () => {
    setConfetti(true)
    setTimeout(() => {
      setConfetti(false)
    }, 1000)
  }

  const reset = () => {
    setSize(1)
    setHealth(4)
    setLastAction(null)
  }

  return (
    <div className="relative mt-24 min-h-[36rem]">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 z-30 size-[20rem] bg-muted-foreground/20 shadow-md [mask-image:url(/assets/hexagon.svg)] md:size-[30rem]" />
      <div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 z-20 size-[20.5rem] bg-background shadow-md [mask-image:url(/assets/hexagon.svg)] md:size-[30.5rem]" />
      <div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 z-10 size-[22rem] bg-muted-foreground/5 shadow-md [mask-image:url(/assets/hexagon.svg)] md:size-[32rem]" />
      <div
        className={
          // biome-ignore lint/nursery/useSortedClasses: <explanation>
          `absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-40 grid place-items-center aspect-square size-[19.5rem] md:size-[29.5rem] [mask-image:url(/assets/hexagon.svg)] bg-gradient-to-b from-background to-background/90 rounded-home_mobile p-4 shadow-md ring-2 ring-border ring-offset-2 ring-offset-background md:rounded-home
          `
        }
      >
        <Image
          src={`/images/plant/${size}-${health}${size > 2 ? '-2' : ''}.svg`}
          height={384}
          width={384}
          className="size-[16rem] md:size-[23rem]"
          alt="plant"
        />
      </div>
      {confetti && <Fireworks autorun={{ speed: 3, duration: 1000 }} />}

      {/* Actions */}
      <Button
        onClick={water}
        variant="outline"
        className="-translate-x-[calc(50%-4rem)] -translate-y-[calc(50%+16rem)] md:-translate-x-[calc(50%+22rem)] md:-translate-y-[calc(50%+8rem)] absolute top-1/2 left-1/2 z-50 h-12 gap-2 rounded-full border-2 pr-8 pl-6 text-lg shadow-md ring-2 ring-border/20 ring-offset-1 hover:shadow-sm"
      >
        <Droplets className="size-4.5 fill-border" />
        {dictionary.water}
      </Button>
      <Image
        src="/assets/arrow3.svg"
        height={400}
        width={400}
        className="-translate-x-[calc(50%-4rem)] -translate-y-[calc(50%+11.7rem)] md:-translate-x-[calc(50%+17.5rem)] md:-translate-y-[calc(50%+4.5rem)] -md:-scale-x-75 absolute top-1/2 left-1/2 z-50 size-[6rem] -md:rotate-[-35deg] dark:hidden"
        alt="plant"
      />
      <Image
        src="/assets/arrow3-dark.svg"
        height={400}
        width={400}
        className="-translate-x-[calc(50%-4rem)] -translate-y-[calc(50%+11.7rem)] md:-translate-x-[calc(50%+17.5rem)] md:-translate-y-[calc(50%+4.5rem)] -md:-scale-x-75 absolute top-1/2 left-1/2 z-50 hidden size-[6rem] -md:rotate-[-35deg] -md:scale-y-75 dark:block"
        alt="plant"
      />
      <Button
        onClick={fertilize}
        variant="outline"
        className="-translate-x-[calc(50%+3rem)] -translate-y-[calc(50%+19.7rem)] md:-translate-x-[calc(50%+25.5rem)] md:-translate-y-[calc(50%+1.8rem)] absolute top-1/2 left-1/2 z-50 h-12 gap-2 rounded-full border-2 pr-8 pl-6 text-lg shadow-md ring-2 ring-border/20 ring-offset-1 hover:shadow-sm"
      >
        <FlaskConical className="size-4.5 fill-border" />
        {dictionary.fertilize}
      </Button>
      <Image
        src="/assets/arrow4.svg"
        height={400}
        width={400}
        className="-translate-x-[calc(50%+4rem)] -translate-y-[calc(50%+13.5rem)] md:-translate-x-[calc(50%+20rem)] md:-translate-y-[calc(50%-1.5rem)] absolute top-1/2 left-1/2 z-50 size-[6rem] -md:rotate-[60deg] dark:hidden"
        alt="plant"
      />
      <Image
        src="/assets/arrow4-dark.svg"
        height={400}
        width={400}
        className="-translate-x-[calc(50%+4rem)] -translate-y-[calc(50%+13.5rem)] md:-translate-x-[calc(50%+20rem)] md:-translate-y-[calc(50%-1.5rem)] absolute top-1/2 left-1/2 z-50 hidden size-[6rem] -md:rotate-[60deg] dark:block"
        alt="plant"
      />

      {/* <p className="-translate-x-[33rem] absolute top-1/2 left-1/2 z-50 max-w-[17rem] translate-y-[8rem] text-muted-foreground">
        Dynamic and interactive digital assets, easily customizable and
        customizable.
      </p> */}

      <div className="md:-translate-y-[12rem] absolute top-1/2 left-1/2 z-50 -md:hidden w-full max-w-[20rem] sm:max-w-[15rem] sm:translate-x-[4rem] md:translate-x-[14rem]">
        <HomeHeading className="-translate-x-1 -translate-y-1">
          {dictionary.title}
        </HomeHeading>
        <HomeDescription className="">{dictionary.description}</HomeDescription>
      </div>

      {/* Attributes */}
      <Image
        src="/assets/line1.svg"
        height={400}
        width={400}
        className="-translate-x-[calc(50%+3rem)] -translate-y-[calc(50%-11rem)] md:-translate-x-[calc(50%-14.5rem)] md:-translate-y-[calc(50%-7rem)] absolute top-1/2 left-1/2 z-50 size-[11rem] -md:rotate-45 dark:hidden"
        alt="plant"
      />
      <Image
        src="/assets/line1-dark.svg"
        height={400}
        width={400}
        className="-translate-x-[calc(50%+4.5rem)] -translate-y-[calc(50%-12rem)] md:-translate-x-[calc(50%-14.5rem)] md:-translate-y-[calc(50%-7rem)] top-1/2 left-1/2 z-50 hidden size-[11rem] -md:rotate-45 dark:absolute"
        alt="plant"
      />
      <p className="md:-translate-y-[calc(50%-7rem)] absolute top-1/2 left-1/2 z-50 translate-x-[-1rem] translate-y-[14.5rem] font-medium text-lg text-muted-foreground md:translate-x-[19rem]">
        {dictionary.growth}: {25 * size}%
      </p>
      <Image
        src="/assets/line2.svg"
        height={400}
        width={400}
        className="-translate-x-[calc(50%+2rem)] -translate-y-[calc(50%-11rem)] md:-translate-x-[calc(50%-14.5rem)] md:-translate-y-[calc(50%-7rem)] absolute top-1/2 left-1/2 z-50 size-[11rem] -md:rotate-45 dark:hidden"
        alt="plant"
      />
      <Image
        src="/assets/line2-dark.svg"
        height={400}
        width={400}
        className="-translate-x-[calc(50%-14.5rem)] -translate-y-[calc(50%-7rem)] absolute top-1/2 left-1/2 z-50 hidden size-[11rem] dark:block"
        alt="plant"
      />
      <p className="md:-translate-y-[calc(50%-9.6rem)] absolute top-1/2 left-1/2 z-50 translate-x-[0rem] translate-y-[12.5rem] font-medium text-lg text-muted-foreground md:translate-x-[19rem]">
        {dictionary.health}: {health * 25}%
      </p>
      {size > 1 && health > 1 && (
        <Button
          onClick={reset}
          variant="outline"
          size="sm"
          className="-translate-y-[calc(50%-13rem)] absolute top-1/2 left-1/2 z-50 translate-x-[19rem] gap-1.5 rounded-full text-muted-foreground"
        >
          <RefreshCcw className="size-3" />
          {dictionary.reset}
        </Button>
      )}
    </div>
  )
}
