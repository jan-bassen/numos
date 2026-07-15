import { Button } from '@repo/ui/components/button'
import { PiArrowRightStroke } from '@repo/ui/icons/pika'
import Image from 'next/image'
import Link from 'next/link'
import type { Dictionary } from '@/dictionaries/dictionaries'
import { getStudioUrl } from '@/lib/urls'

export function Hero({ dictionary }: { dictionary: Dictionary['home'] }) {
  const studioUrl = getStudioUrl()

  return (
    <div className="relative w-full overflow-visible pt-28 pb-12 md:pt-64 md:pb-64">
      <div className="flex w-full flex-col items-center space-y-6 pl-3 font-heading sm:space-y-4 md:space-y-6 md:pl-4">
        <div className="flex h-7 items-center rounded-full border border-border bg-muted/40 px-3 text-muted-foreground text-xs">
          {dictionary.eyebrow}
        </div>
        <h1 className="!leading-[1.1] sm:!leading-[1.2] md:!text-[3.2rem] w-full max-w-[23rem] xs:max-w-[26rem] px-2 xs:px-0 text-center font-black xs:font-extrabold text-[2.8rem] xs:text-[3.2rem]">
          {dictionary.title}
        </h1>
        <p className="-translate-y-1 w-full max-w-sm text-pretty pb-3 text-center text-lg text-muted-foreground xs:text-lg max-xs:px-[10vw] md:text-xl">
          {dictionary.description}
        </p>
        <Button
          asChild
          className="!px-6 sm:!px-10 flex h-12 items-center gap-2 rounded-full text-lg"
        >
          <Link href={studioUrl}>
            {dictionary.ctaButton}
            <PiArrowRightStroke className="size-4" />
          </Link>
        </Button>
      </div>
      {/* <div className="-translate-x-1/2 -translate-y-[calc(50%-5rem)] -z-10 absolute top-1/2 left-1/2 h-[60vw] w-[60vw] rounded-full border border-border" /> */}
      {/* <div className="-translate-x-1/2 -translate-y-[calc(50%-5rem)] -z-10 absolute top-1/2 left-1/2 h-[75vw] w-[75vw] rounded-full border border-border" /> */}
      {/* <div className="-translate-x-1/2 -translate-y-[calc(50%-5rem)] -z-10 absolute top-1/2 left-1/2 h-[90vw] w-[90vw] rounded-full border border-border" /> */}
      <div className="-translate-x-1/2 -translate-y-[calc(50%-5rem)] -z-20 absolute inset-0 top-1/2 left-1/2 max-lg:hidden h-[60vw] max-h-[50rem] w-[60vw] max-w-[50rem] rounded-full border border-border bg-gradient-to-r from-muted/40 via-background to-muted/20" />
      <div className="-translate-x-1/2 -translate-y-[calc(50%-5rem)] -z-30 absolute inset-0 top-1/2 left-1/2 max-md:hidden h-[75vw] max-h-[65rem] w-[75vw] max-w-[65rem] rounded-full border border-border bg-gradient-to-r from-muted/20 via-background to-muted/30" />
      <div className="-translate-x-1/2 -translate-y-[calc(50%-5rem)] -z-40 absolute inset-0 top-1/2 left-1/2 max-md:hidden h-[90vw] max-h-[80rem] w-[90vw] max-w-[80rem] rounded-full border border-border bg-gradient-to-r from-muted/30 via-background to-muted/30" />
      <div className="-translate-x-1/2 -translate-y-[calc(50%-5rem)] -z-10 absolute inset-0 top-1/2 left-1/2 max-md:hidden h-[90vw] max-h-[80rem] w-[90vw] max-w-[80rem] bg-gradient-to-b from-30% from-background to-40% to-transparent" />
      <div className="-translate-x-1/2 -translate-y-[calc(50%-5rem)] -z-10 absolute inset-0 top-1/2 left-1/2 max-md:hidden h-[90vw] max-h-[80rem] w-[90vw] max-w-[80rem] bg-gradient-to-t from-30% from-background to-40% to-transparent" />
      <Image
        src="/assets/creature.png"
        alt="Creature"
        width={400}
        height={400}
        // biome-ignore lint/nursery/useSortedClasses: <explanation>
        className={`absolute inset-0 top-1/2 left-1/2 max-md:hidden aspect-square -rotate-12 bg-transparent object-cover opacity-90 transition-all duration-300
          size-16
          md:translate-x-[calc(-50%+18rem)] 
          lg:size-20
          xl:translate-x-[calc(-50%+23rem)] 
          translate-y-[calc(-50%+15rem)] 
          `}
      />
      <Image
        src="/assets/ticket.png"
        alt="Ticket"
        width={400}
        height={400}
        // biome-ignore lint/nursery/useSortedClasses: <explanation>
        className={`
          absolute inset-0 top-1/2 left-1/2 max-md:hidden aspect-square translate-y-[calc(-50%-6rem)] rotate-12 bg-transparent object-cover opacity-90
          size-18 
          lg:size-20
          translate-x-[calc(-50%-20rem)]
          lg:translate-x-[calc(-50%-22rem)]
          xl:translate-x-[calc(-50%-25rem)] 
          `}
      />
      <Image
        src="/assets/hat.png"
        alt="Hat"
        width={400}
        height={400}
        // biome-ignore lint/nursery/useSortedClasses: <explanation>
        className={`
          -rotate-4 absolute inset-0 top-1/2 left-1/2 aspect-square  translate-y-[calc(-50%+10rem)] bg-transparent object-cover opacity-90  transition-all duration-300
          size-12
          lg:size-16 
          max-md:hidden 
          translate-x-[calc(-50%-21rem)]
          lg:translate-x-[calc(-50%-25rem)]
          xl:translate-x-[calc(-50%-32rem)]
          `}
      />
      <Image
        src="/assets/artwork.png"
        alt="Artwork"
        width={400}
        height={400}
        // biome-ignore lint/nursery/useSortedClasses: <explanation>
        className={`
          -rotate-6 absolute inset-0 top-1/2 left-1/2 max-md:hidden aspect-square  bg-transparent object-cover opacity-90   transition-all duration-300

          size-12
          lg:size-16 
          translate-y-[calc(-50%-5rem)]
          lg:translate-y-[calc(-50%-3rem)]
          translate-x-[calc(-50%+19rem)]
          lg:translate-x-[calc(-50%+24rem)]
          xl:translate-x-[calc(-50%+31rem)]
          `}
      />
      <Image
        src="/assets/pfp.png"
        alt="Profile picture"
        width={400}
        height={400}
        // biome-ignore lint/nursery/useSortedClasses: <explanation>
        className={`
          absolute inset-0 top-1/2 left-1/2 max-md:hidden aspect-square  translate-y-[calc(-50%+1rem)] rotate-6 rounded-md bg-transparent object-cover opacity-90
          size-14
          lg:size-18
          translate-x-[calc(-50%-22rem)]
          lg:translate-x-[calc(-50%-25rem)]
          xl:translate-x-[calc(-50%-32rem)]
          `}
      />
      <Image
        src="/assets/cactus.png"
        alt="Cactus"
        width={400}
        height={400}
        // biome-ignore lint/nursery/useSortedClasses: <explanation>
        className={`
          absolute inset-0 top-1/2 left-1/2 aspect-square  bg-transparent object-cover opacity-90  transition-all duration-300
          max-md:hidden
          size-20
          lg:size-24
          translate-y-[calc(-50%+6rem)]
          lg:translate-y-[calc(-50%+8rem)]
          translate-x-[calc(-50%+22rem)]
          lg:translate-x-[calc(-50%+25rem)] 
          xl:translate-x-[calc(-50%+32rem)] 
          `}
      />
      <Image
        src="/assets/spaceship.png"
        alt="Spaceship"
        width={400}
        height={400}
        // biome-ignore lint/nursery/useSortedClasses: <explanation>
        className={`
          -rotate-[30deg] absolute inset-0 top-1/2 left-1/2 max-md:hidden aspect-square bg-transparent object-cover opacity-80 translate-y-[calc(-50%+16rem)] transition-all duration-300
          size-12
          lg:size-16
          xl:translate-x-[calc(-50%-22rem)]
          translate-x-[calc(-50%-17rem)]
          `}
      />
    </div>
  )
}
