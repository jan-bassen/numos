import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@repo/ui/components/ui/carousel'
import { PiSwipeRightHandStroke } from '@/lib/icons'
import { Tweet } from 'react-tweet'

const tweets = [
  '1580585716907618305',
  '1568279985206530048',
  '1522383627090337792',
  '1512079178643869711',

  /* 
  good but with media:
  "1674054317924392961",
  "1632689982149210114", */

  /* 
  not great but ok: 
  "1470856847372529665",
  "1354777468968775683",
  "1568942505068216324",
  "1745261578637779213", */
]

export default function TweetCarousel() {
  return (
    <div className="w-full overflow-hidden md:overflow-visible">
      <Carousel className="">
        <CarouselContent className="">
          {tweets.map((tweet, index) => (
            <CarouselItem className=" flex justify-center" key={tweet}>
              <Tweet id={tweet} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <p className="flex w-full items-center justify-center gap-2 text-sm text-muted-foreground md:hidden">
        <PiSwipeRightHandStroke className="size-3.5" />
        Swipe to see more
      </p>
    </div>
  )
}
