import { Button } from '@repo/ui/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@repo/ui/components/ui/card'
import { PiNftDefaultDuoSolid, PiNftDefaultStroke } from '@/lib/icons'
import { cn } from '@/lib/utils'
import {
  Droplets,
  Flower,
  Palette,
  Pipette,
  Ruler,
  Wand2,
  Wind,
} from 'lucide-react'
import Image from 'next/image'

const attributes = [
  { Icon: Ruler, name: 'Size', value: '24' },
  { Icon: Flower, name: 'Stage', value: 'growth' },
  { Icon: Palette, name: 'Color', value: 'red' },
  { Icon: Wind, name: 'Fragrance', value: 'slight' },
]

function Arrow({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 70 20"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <title>arrow</title>
      <g transform="matrix(1.92409,0,0,0.572886,-2433.14,-403.49)">
        <rect
          x="1264.57"
          y="704.312"
          width="36.381"
          height="34.911"
          className="bg-none fill-none"
        />
        <g transform="matrix(0.57885,0,0,1.94412,1285.89,696.874)">
          <path
            stroke="hsl(var(--border))"
            strokeWidth={1.5}
            fill="none"
            d="M13.55,7.054C16.005,7.942 18.334,9.145 20.48,10.631C20.663,10.758 20.79,10.939 20.85,11.14M16.976,18.555C18.544,16.469 19.836,14.188 20.819,11.77C20.901,11.57 20.912,11.348 20.85,11.14M20.85,11.14C-3.86,19.375 -20.384,15.923 -31.707,12.805"
          />
        </g>
      </g>
    </svg>
  )
}

function ArrowM({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 70 70"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <title>arrow</title>
      <g transform="matrix(1,0,0,1,-1.36424e-12,-34.1777)">
        <g transform="matrix(1.92409,0,0,2.0051,-2433.14,-1378.04)">
          <rect
            x="1264.57"
            y="704.312"
            width="36.381"
            height="34.911"
            className="bg-none fill-none"
          />
          <g transform="matrix(0.57885,0,0,0.555463,1284.04,721.773)">
            <path
              stroke="hsl(var(--border))"
              strokeWidth={1.5}
              fill="none"
              d="M13.55,7.054C16.005,7.942 18.334,9.145 20.48,10.631C20.663,10.758 20.79,10.939 20.85,11.14M16.976,18.555C18.544,16.469 19.836,14.188 20.819,11.77C20.901,11.57 20.912,11.348 20.85,11.14M20.85,11.14C-3.86,19.375 -36.602,33.357 -21.436,-19.225"
            />
          </g>
        </g>
      </g>
    </svg>
  )
}

export default function Diagram() {
  return (
    <div className="w-full h-fit pt-5 pb-10 relative flex flex-col md:flex-row justify-start md:justify-center items-center md:items-start gap-8 md:gap-0">
      <div className="w-fit h-fit flex justify-center gap-2">
        <ArrowM className="md:hidden w-20 rotate-[80deg] shrink-0  translate-y-12" />
        <div className="transition-transform  md:translate-y-4 lg:translate-y-1 md:translate-x-9 lg:translate-x-4 flex flex-col gap-3 md:gap-4 lg:gap-7">
          <Button
            variant={'outline'}
            className="flex gap-2 shadow-sm text-base rounded-xl font-medium p-6 pl-5"
          >
            <Droplets className="size-4" />
            Water
          </Button>
          <Button
            variant={'outline'}
            className="transition-transform rounded-xl translate-x-7 md:-translate-x-7 lg:-translate-x-8 flex gap-2 shadow-sm text-base font-medium p-6 pl-5"
          >
            <Pipette className="size-4" />
            Fertalize
          </Button>
          <Button
            variant={'outline'}
            className="transition-transform rounded-xl translate-x-4 md:-translate-x-5 flex gap-2 shadow-sm text-base font-medium p-6 pl-5"
          >
            <Wand2 className="size-4" />
            Enchant
          </Button>
        </div>
      </div>
      <Arrow className="hidden md:block md:translate-y-28 lg:translate-y-[7.5rem] md:translate-x-4 lg:translate-x-4 w-20 rotate-[20deg] shrink-0" />
      <Card className="transition-transform w-full xs:w-72 md:translate-y-5 md:translate-x-6 lg:translate-x-10 shrink-0 rounded-3xl md:w-64 lg:w-72 px-8 py-6 gap-8 flex flex-col">
        <div className="flex flex-col items-center">
          <PiNftDefaultStroke className="size-6 mb-1.5" />
          <CardHeader className="font-semibold text-lg font-mona p-0">
            Magnolia
          </CardHeader>
          <CardDescription className="text-sm font-mona p-0">
            A beautiful flower
          </CardDescription>
        </div>
        <CardContent className="p-0">
          <ul className="flex flex-col gap-2 text-sm">
            {attributes.map((attr) => (
              <li key={attr.name} className="flex justify-between">
                <span className="flex gap-1.5 items-center">
                  <attr.Icon className="size-3.5" /> {attr.name}
                </span>
                <span className=" text-muted-foreground">{attr.value}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <Arrow className="hidden md:block md:translate-y-32 lg:translate-y-32 md:translate-x-7 lg:translate-x-[3.6rem] w-20 -rotate-[12deg] shrink-0" />
      <div className="w-fit h-fit flex justify-center shrink-0 items-start gap-2">
        <Image
          src="/example_flower.jpg"
          alt="flower"
          width={564}
          height={564}
          className="size-56 shrink-0 transition-transform border border-border rounded-2xl shadow-sm md:translate-y-2 lg:translate-y-0 md:translate-x-9 lg:translate-x-20"
        />
        <ArrowM className="md:hidden w-20 -scale-x-100 -rotate-[30deg] shrink-0" />
      </div>
    </div>
  )
}
