import { Card, CardContent } from '@repo/ui/components/ui/card'
import { HomeDescription } from '../heading'
import { HomeHeading } from '../heading'
import { cn } from '@repo/ui/lib/utils'
import { Arrow1 } from '@repo/ui/components/assets/arrow-1'
import { Arrow2 } from '@repo/ui/components/assets/arrow-2'
import { ImageGraphic } from '@/app/(web)/(components)/architecture/image-graphic'
import { TraitsGraphic } from '@/app/(web)/(components)/architecture/traits-graphic'
import { InteractionGraphic } from '@/app/(web)/(components)/architecture/interaction-graphic'
import Image from 'next/image'

function ArchitectureInfo({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex w-full flex-col items-start space-y-2 pl-2 lg:pl-8',
        className,
      )}
    >
      <HomeHeading className=" w-full">Easy setup, no limitations</HomeHeading>
      <HomeDescription className="w-full max-w-xl pl-0.5">
        Building with Numos is simple - your vision grows, and we grow with you.
        Our modular platform lets you create collections that evolve and expand
        seamlessly, adapting to your journey and ideas every step of the way.
      </HomeDescription>
    </div>
  )
}

const cards = [
  {
    title: 'Interact with your asset',
    subtitle:
      'Make your asset fun with custom interactions. Trigger them with a simple click, token activity, or anything else.',
    graphic: InteractionGraphic,
    className:
      'col-start-1 xs:col-span-4 lg:!col-span-2 lg:!row-start-1 xs:row-span-2',
  },
  {
    title: 'Change traits with actions',
    subtitle:
      'Define unique traits that set your assets apart and make them dynamic through interactions.',
    graphic: TraitsGraphic,
    className:
      'col-start-1 xs:col-start-2 lg:col-start-3 xs:col-span-4 lg:!col-span-2 row-start-2 xs:row-start-3 lg:!row-start-2 xs:row-span-2',
  },
  {
    title: 'Update the image via traits',
    subtitle:
      'The image brings your NFT to life, visually reflecting its traits. When traits change, the image updates automatically.',
    graphic: ImageGraphic,
    className:
      'col-start-1 xs:col-start-3 lg:!col-start-5 xs:col-span-4 lg:!col-span-2 row-start-3 xs:row-start-5 lg:!row-start-3 xs:row-span-2',
  },
]

export function Architecture() {
  return (
    <div className="relative flex w-full flex-col space-y-6 py-12 -sm:pb-32 lg:items-center lg:space-y-10 lg:pb-6">
      <ArchitectureInfo className="lg:hidden" />
      <div className="group lg:!grid-rows-4 grid w-full max-w-lg grid-cols-1 xs:grid-cols-6 grid-rows-1 xs:grid-rows-6 items-center gap-4 lg:max-w-5xl">
        <div
          // biome-ignore lint/nursery/useSortedClasses: <explanation>
          className="
          col-start-1
          lg:col-start-3 
          col-span-6 
          lg:col-span-4
          row-start-1  
          row-span-1 
          -lg:hidden
          w-full"
        >
          <ArchitectureInfo />
        </div>
        <Image
          src="/assets/arrow2.svg"
          alt="Arrow"
          width={400}
          height={400}
          // biome-ignore lint/nursery/useSortedClasses: <explanation>
          className="
          -xs:hidden
          col-start-5 
          row-start-2
          xs:row-start-2
          lg:!row-start-2
          mt-auto size-16 lg:ml-2 lg:size-16 dark:hidden"
        />
        <Image
          src="/assets/arrow2-dark.svg"
          alt="Arrow"
          width={400}
          height={400}
          // biome-ignore lint/nursery/useSortedClasses: <explanation>
          className="
          -xs:hidden
          col-start-5 
          row-start-2
          xs:row-start-2
          lg:!row-start-2
          mt-auto size-16 lg:ml-2 lg:size-16 hidden dark:xs:block"
        />
        <Image
          src="/assets/arrow1.svg"
          alt="Arrow"
          width={400}
          height={400}
          // biome-ignore lint/nursery/useSortedClasses: <explanation>
          className="
          -xs:hidden
          col-start-2 
          row-start-5 
          xs:row-start-5
          lg:!row-start-3
          mb-auto ml-auto size-12 lg:mt-2 lg:mr-2 lg:size-16 dark:hidden"
        />
        <Image
          src="/assets/arrow1-dark.svg"
          alt="Arrow"
          width={400}
          height={400}
          // biome-ignore lint/nursery/useSortedClasses: <explanation>
          className="
          -xs:hidden
          col-start-2 
          row-start-5 
          xs:row-start-5
          lg:!row-start-3
          mb-auto ml-auto size-12 lg:mt-2 lg:mr-2 lg:size-16 light:hidden dark:xs:block"
        />
        {cards.map((card) => (
          <ArchtiectureCard key={card.title} card={card}>
            {card.graphic && <card.graphic />}
          </ArchtiectureCard>
        ))}

        {/* <div
          // biome-ignore lint/nursery/useSortedClasses: <explanation>
          className="
          col-start-1 
          xs:col-span-4 
          md:!col-span-2
          md:!row-start-1
          xs:row-span-2
          aspect-square w-full rounded-home_mobile border border-border bg-muted lg:rounded-home"
        />
        <div
          // biome-ignore lint/nursery/useSortedClasses: <explanation>
          className="
          col-start-1 
          xs:col-start-2
          md:col-start-3 
          xs:col-span-4 
          md:!col-span-2 
          row-start-2
          xs:row-start-3
          md:!row-start-2
          xs:row-span-2
          aspect-square w-full rounded-home_mobile border border-border bg-muted lg:rounded-home"
        />
        <div
          // biome-ignore lint/nursery/useSortedClasses: <explanation>
          className="
          col-start-1
          xs:col-start-3
          md:!col-start-5 
          xs:col-span-4 
          md:!col-span-2 
          row-start-3
          xs:row-start-5
          md:!row-start-3
          xs:row-span-2 
          aspect-square w-full rounded-home_mobile border border-border bg-muted lg:rounded-home"
        /> */}
      </div>
    </div>
  )
}

function ArchtiectureCard({
  card,
  children,
}: {
  card: (typeof cards)[number]
  children?: React.ReactNode
}) {
  return (
    <Card
      className={cn(
        '!rounded-home_mobile lg:!rounded-home -sm:min-h-80 overflow-hidden sm:aspect-square',
        card.className,
      )}
    >
      <CardContent className="flex h-full flex-col gap-1 p-0">
        <div className="h-full -sm:max-h-60 w-full overflow-hidden">
          {children}
        </div>
        <div className="flex h-fit shrink-0 flex-col gap-1 px-5 pt-0 pb-5">
          <span className="font-semibold text-lg">{card.title}</span>
          <span className="text-muted-foreground text-sm leading-tight">
            {card.subtitle}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
