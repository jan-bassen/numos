'use client'

import { Button } from '@repo/ui/components/ui/button'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Droplets, Pipette } from 'lucide-react'
import { PiArrowRightStroke, PiRefreshStroke } from '@repo/ui/icons/pika'
import { Tabs, TabsList, TabsTrigger } from '@repo/ui/components/ui/tabs'
import { Slider } from '@repo/ui/components/ui/slider'
import { Label } from '@repo/ui/components/ui/label'
import Fireworks from 'react-canvas-confetti/dist/presets/fireworks'

export default function Hero() {
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
    }, 2000)
  }

  const reset = () => {
    setSize(1)
    setHealth(4)
    setLastAction(null)
  }

  return (
    <div className="flex flex-col items-center gap-6 px-6 pb-6 pt-16 md:gap-0 md:px-20">
      <div className="flex flex-col gap-6">
        <h1 className="text-balance pb-12 font-outfit text-5xl font-bold sm:!text-7xl xs:text-6xl">
          The next generation of digital assets
        </h1>
        {/*       <Link
          href="/blog"
          className="z-30 flex w-fit items-center gap-3 rounded-full bg-muted px-6 py-1.5"
        >
          Read the announcement
          <PiArrowRightStroke className="size-3.5" />
        </Link> */}
      </div>
      {confetti && <Fireworks autorun={{ speed: 3, duration: 1500 }} />}
      <Image
        src={`/images/plant/${size}-${health}${size > 2 ? '-1' : ''}.svg`}
        height={586}
        width={586}
        alt="plant graphic"
        className="mb-6 size-full md:hidden"
      />

      <div className="sm:pr-auto flex h-fit w-fit flex-col justify-center gap-4 pr-8 sm:w-full sm:flex-row sm:gap-8 md:relative md:block md:h-[586px] md:gap-2 lg:-translate-y-16">
        {health === 4 && size === 1 && (
          <div className="absolute right-0 top-20 hidden translate-x-8 gap-5 md:flex">
            <Image
              src="/graphics/arrow_l.svg"
              height={100}
              width={100}
              alt="arrow"
              className="mt-10 opacity-[0.03] dark:hidden"
            />
            <Image
              src="/graphics/arrow_d.svg"
              height={120}
              width={120}
              alt="arrow"
              className="mt-10 hidden opacity-[0.03] dark:block"
            />
            <div className="text-muted-foreground opacity-50">
              <h3 className="text-3xl font-semibold">try to</h3>
              <h3 className="text-3xl font-semibold">make it grow</h3>
            </div>
          </div>
        )}
        {health !== 1 && (
          <>
            <div className="z-20 flex items-center gap-3 font-semibold md:absolute md:bottom-[50px] md:right-[530px]">
              <p className="hidden md:block">Water</p>
              <Button size={'icon'} onClick={() => water()}>
                <Droplets size={16} className="size-4" />
              </Button>
              <p className="md:hidden">Water</p>
            </div>

            <div className="z-20 flex items-center gap-3 font-semibold md:absolute md:bottom-[80px] md:right-[80px]">
              <Button size={'icon'} onClick={() => fertilize()}>
                <Pipette size={16} className="size-4" />
              </Button>
              Fertilize
            </div>
            {/* <div
              className={cn(
                "md:absolute md:right-[520px] md:bottom-[120px] z-20 flex gap-3 items-center font-semibold",
                size < 3 || (health === 1 && "text-muted-foreground")
              )}
            >
              <p className="hidden md:block">Enchant</p>
              <Button
                size={"icon"}
                disabled={size < 3 || health === 1}
                onClick={() => enchant()}
              >
                <Wand2 size={16} className="size-4" />
              </Button>
              <p className="md:hidden">Enchant</p>
            </div> */}
          </>
        )}
        {health === 4 && size === 1 ? null : (
          <Button
            variant={'ghost'}
            onClick={() => reset()}
            className="absolute bottom-0 right-0 z-20 hidden gap-1.5 text-muted-foreground md:flex"
          >
            <PiRefreshStroke className="size-3" />
            Reset
          </Button>
        )}
        <Image
          src={`/images/plant/${size}-${health}${size > 2 ? '-1' : ''}.svg`}
          height={586}
          width={586}
          alt="plant graphic"
          className="hidden size-[586px] md:absolute md:right-20 md:block"
        />
        <div className="hidden size-[586px] translate-y-14 bg-gradient-radial from-foreground/5 via-transparent to-transparent opacity-50 dark:from-foreground/[0.03] dark:via-transparent md:absolute md:right-20 md:block" />
      </div>
      <div className="flex min-h-8 w-full justify-end px-2 md:hidden">
        {health === 4 && size === 1 ? null : (
          <Button
            variant={'ghost'}
            onClick={() => reset()}
            className="z-20 gap-1.5 text-muted-foreground"
          >
            <PiRefreshStroke className="size-3" />
            Reset
          </Button>
        )}
      </div>
    </div>
  )
}

export function Hero2() {
  const [size, setSize] = useState(4)
  const [health, setHealth] = useState(4)
  const [flower, setFlower] = useState('crocus')

  return (
    <div className="flex min-h-40 flex-col gap-4 pb-10">
      <div className="flex flex-col items-center gap-6 lg:grid lg:grid-cols-9 lg:gap-14">
        <div className="col-span-4 lg:size-full">
          <Image
            src={`/images/plant/${size}-${health}${
              size > 2 ? (flower === 'crocus' ? '-2' : '-1') : ''
            }.svg`}
            height={384}
            width={384}
            className="size-96"
            alt="plant"
          />
        </div>
        <div className="col-span-5 flex w-full flex-col items-center gap-8 lg:items-start">
          <div className="col-span-5 flex flex-col gap-4">
            <h2 className="text-balance text-center text-[2.5rem] font-extrabold leading-[1.05] md:text-[2.8rem] md:leading-[1.15] lg:text-left">
              Go beyond jpegs
            </h2>
            <p className="max-w-[40rem] pl-0.5 text-center text-muted-foreground lg:max-w-none lg:text-left">
              Create an entirely new layer of discovery for your users through
              dynamic and interactive aspects to your digital assets.
            </p>
          </div>
          <div className="col-span-5 flex w-full flex-col gap-6 sm:w-80 lg:w-[30rem]">
            <Tabs value={flower} onValueChange={setFlower}>
              <TabsList className="w-full lg:w-80">
                <TabsTrigger value="chrysanth" className="w-full">
                  Chrysanth
                </TabsTrigger>
                <TabsTrigger value="crocus" className="w-full">
                  Crocus
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="space-y-2">
              <Label>Size</Label>
              <Slider
                value={[size]}
                onValueChange={(n: number[]) => setSize(n[0] || 1)}
                min={1}
                max={4}
                step={1}
                className="w-full opacity-50"
              />
            </div>
            <div className="space-y-2">
              <Label>Health</Label>
              <Slider
                value={[health]}
                onValueChange={(n: number[]) => setHealth(n[0] || 1)}
                min={1}
                max={4}
                step={1}
                className="w-full opacity-50"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
