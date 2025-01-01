import { Hero } from './(components)/hero'
import { Example } from './(components)/example'
import { HomeDescription, HomeHeading } from './(components)/heading'
import { Benefits } from './(components)/benefits'
import { Architecture } from './(components)/architecture'
import { Easy } from './(components)/easy'
import { Pricing } from './(components)/pricing'
import { Team } from './(components)/team'
import Image from 'next/image'
import Link from 'next/link'

export default async function Home() {
  return (
    <div className="relative flex w-full flex-col items-center">
      <Hero />
      <main className="relative w-full space-y-24 overflow-visible px-4 pt-20 pb-52 md:px-8 xl:px-0">
        <div className="relative flex w-full flex-col items-center space-y-4 md:space-y-10">
          <div className="flex w-full flex-col items-center space-y-4 pl-3 font-poppins md:space-y-6 md:pl-4">
            <h1 className="w-full text-center font-black text-4xl md:text-5xl">
              Digital assets that feel alive
            </h1>
            <p className="w-full max-w-xl text-center text-muted-foreground md:text-lg">
              Bring your ideas to life with interactive and evolving NFTs—no
              coding required. Our platform empowers creators to design,
              customize, and launch unique digital assets effortlessly.
            </p>
          </div>
          <Example />
        </div>
        <div className="relative flex w-full flex-col items-center space-y-6 md:space-y-10">
          <div className="flex w-full flex-col items-center space-y-4 pl-3 md:pl-4">
            <HomeHeading className=" w-full max-w-2xl md:text-center">
              Unlock new possibilities
            </HomeHeading>
            <HomeDescription className=" w-full md:max-w-lg md:text-center">
              Bring your ideas to life with interactive and evolving NFTs—no
              coding required. Our platform empowers creators to design,
              customize, and launch. Our platform empowers creators to.
            </HomeDescription>
          </div>
          <Benefits />
        </div>
        <Architecture />
        <div className="md:!mt-6 relative flex w-full flex-col items-center space-y-6 md:space-y-10">
          <div className="w-full max-w-5xl space-y-4 pl-3 md:pl-4">
            <HomeHeading className="w-full max-w-xl ">
              No worries about infrastructure
            </HomeHeading>
            <HomeDescription className="w-full max-w-2xl">
              Bring your ideas to life with interactive and evolving NFTs—no
              coding required. Our platform empowers creators to design,
              customize, and launch.
            </HomeDescription>
          </div>
          <Easy />
        </div>
        <div className="relative flex w-full flex-col items-center space-y-6 md:space-y-10">
          <div className="flex w-full flex-col items-center space-y-4 pl-3 md:pl-4">
            <HomeHeading className="w-full md:max-w-2xl md:text-center">
              Predictable pricing
            </HomeHeading>
            <HomeDescription className=" w-full md:max-w-lg md:text-center">
              Bring your ideas to life with interactive and evolving NFTs—no
              coding required. Our platform empowers creators to design.
            </HomeDescription>
          </div>
          <Pricing />
        </div>
        <div className="relative flex w-full flex-col items-center space-y-6 md:space-y-10">
          <div className="relative w-full md:max-w-xl">
            <div className="relative flex w-full flex-col items-center space-y-4 pl-3 md:pl-4">
              <HomeHeading className=" w-full md:max-w-lg md:text-center">
                Made by Apes with love
              </HomeHeading>
              <HomeDescription className=" w-full md:max-w-lg md:text-center">
                Bring your ideas to life with interactive and evolving NFTs—no
                coding required. Our platform empowers creators to design.
              </HomeDescription>
            </div>
            <Link
              href="https://madeby.boredapeyachtclub.com/bodega/CHGSEWJVFEGRAR"
              className="-md:-top-[40px] absolute -md:right-0 rotate-12 opacity-70 transition-all duration-300 hover:rotate-0 hover:scale-110 hover:opacity-100 md:top-[15px] md:right-[60px]"
            >
              <Image src="/home/MBA.svg" alt="MBA" width={80} height={80} />
            </Link>
          </div>
          <Team />
        </div>
      </main>
    </div>
  )
}
