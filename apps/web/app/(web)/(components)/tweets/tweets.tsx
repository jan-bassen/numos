import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@repo/ui/components/ui/carousel'
import { PiSwipeRightHandStroke } from '@repo/ui/icons/pika'
import { Tweet } from '@/app/(web)/(components)/tweets/tweet'

const tweets = [
  '1857087190284509346',
  '1884960960550465544',
  '1580585716907618305',
  '1522383627090337792',
  '1568279985206530048',
  '1512079178643869711',

  /* 
  good but with media:
  "1674054317924392961",
  "1632689982149210114", */

  /* 
  not great but ok: 
  '1846243562813358332',
  "1470856847372529665",
  "1354777468968775683",
  "1568942505068216324",
  "1745261578637779213", */
]

export function Tweets() {
  return (
    <div className="grid w-full place-items-center pt-6 pb-12">
      <Carousel className="w-[calc(100vw-3rem)] max-w-[calc(550px-1rem)] xl:max-w-7xl">
        <CarouselContent className="px-1">
          {tweets.map((tweet, index) => (
            <CarouselItem
              className="flex h-fit justify-center xl:basis-1/3"
              key={tweet}
            >
              <Tweet id={tweet} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex" />
        <CarouselNext className="hidden sm:flex" />
      </Carousel>
      <p className="flex w-full items-center justify-center gap-2 text-muted-foreground text-sm md:hidden">
        <PiSwipeRightHandStroke className="size-3.5" />
        Swipe to see more
      </p>
    </div>
  )
}
