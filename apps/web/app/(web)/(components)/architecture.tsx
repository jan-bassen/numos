import { Card, CardContent } from '@repo/ui/components/ui/card'
import { Arrow } from './arrow'
import { HomeDescription } from './heading'
import { HomeHeading } from './heading'
import { cn } from '@repo/ui/lib/utils'

function ArchitectureInfo({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex w-full flex-col items-center space-y-3 pl-2 lg:pl-8',
        className,
      )}
    >
      <HomeHeading className=" w-full">Modular & Extensible</HomeHeading>
      <HomeDescription className="w-full">
        Bring your ideas to life with interactive and evolving NFTs—no coding
        required.
      </HomeDescription>
    </div>
  )
}

const cards = [
  {
    title: 'Interaction',
    className:
      'col-start-1 xs:col-span-4 md:!col-span-2 md:!row-start-1 xs:row-span-2',
  },
  {
    title: 'Traits',
    className:
      'col-start-1 xs:col-start-2 md:col-start-3 xs:col-span-4 md:!col-span-2 row-start-2 xs:row-start-3 md:!row-start-2 xs:row-span-2',
  },
  {
    title: 'Events',
    className:
      'col-start-1 xs:col-start-3 md:!col-start-5 xs:col-span-4 md:!col-span-2 row-start-3 xs:row-start-5 md:!row-start-3 xs:row-span-2',
  },
]

export function Architecture() {
  return (
    <div className="relative flex w-full flex-col space-y-6 md:items-center md:space-y-10">
      <ArchitectureInfo className="md:hidden" />
      <div className="group md:!grid-rows-4 grid w-full max-w-md grid-cols-1 xs:grid-cols-6 grid-rows-1 xs:grid-rows-6 items-center gap-4 md:max-w-5xl">
        <div
          // biome-ignore lint/nursery/useSortedClasses: <explanation>
          className="
          col-start-1
          md:col-start-3 
          col-span-6 
          md:col-span-4
          row-start-1  
          row-span-1 
          -md:hidden
          w-full"
        >
          <ArchitectureInfo />
        </div>
        <Arrow
          // biome-ignore lint/nursery/useSortedClasses: <explanation>
          className="
          -xs:hidden
          col-start-5 
          row-start-2
          xs:row-start-2
          md:!row-start-2
          -scale-x-[100%] -rotate-[70deg] md:-rotate-90 mt-auto size-12 text-muted-foreground md:ml-2 md:size-16"
        />
        <Arrow
          // biome-ignore lint/nursery/useSortedClasses: <explanation>
          className="
          -xs:hidden
          col-start-2 
          row-start-5 
          xs:row-start-5
          md:!row-start-3
          mb-auto ml-auto size-12 text-muted-foreground md:mt-2 md:mr-2 md:size-16"
        />
        {cards.map((card) => (
          <ArchtiectureCard key={card.title} card={card} />
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

function ArchtiectureCard({ card }: { card: (typeof cards)[number] }) {
  return (
    <Card
      className={cn(
        'aspect-square !rounded-home_mobile lg:!rounded-home',
        card.className,
      )}
    >
      <CardContent className="flex h-full items-center justify-center p-6">
        <span className="text-muted-foreground">{card.title}</span>
      </CardContent>
    </Card>
  )
}
