import { Hero } from '@/app/(web)/(components)/hero'
import { Example } from '@/app/(web)/(components)/example'
import { HomeDescription, HomeHeading } from '@/app/(web)/(components)/heading'
import { Benefits } from '@/app/(web)/(components)/benefits'
import { Architecture } from '@/app/(web)/(components)/architecture/architecture'
import { Highlights } from '@/app/(web)/(components)/highlights/highlights'
import { Pricing } from '@/app/(web)/(components)/pricing'
import { Team } from '@/app/(web)/(components)/team'
import Image from 'next/image'
import Link from 'next/link'
import SignUpForm from '@/components/sign-up/sign-up-form'
import { PiCheckTickCircleBrokenStroke } from '@repo/ui/icons/pika'

export default async function Home() {
  return (
    <div className="relative flex w-full flex-col items-center">
      <Hero />
      <main className="relative w-full overflow-visible px-4 pt-20 pb-52 md:px-8 xl:px-0">
        <Example />
        {/* <div className="relative flex w-full flex-col items-center space-y-6 md:space-y-10">
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
        </div> */}

        <Architecture />
        <div className="md:!mt-6 relative flex w-full flex-col items-center space-y-6 pb-32 md:space-y-10">
          <div className="w-full max-w-5xl space-y-2 pl-3 md:pl-4">
            <HomeHeading className="w-full max-w-lg">
              No worries about infrastructure
            </HomeHeading>
            <HomeDescription className="w-full max-w-xl">
              Bring your ideas to life with interactive and evolving NFTs—no
              coding required. Our platform empowers creators to design,
              customize, and launch.
            </HomeDescription>
          </div>
          <Highlights />
        </div>
        <div className="relative flex w-full flex-col items-center space-y-6 pb-32 md:space-y-10">
          <div className="flex w-full flex-col space-y-4 pl-4 sm:items-center">
            <HomeHeading className="w-full md:max-w-2xl md:text-center">
              Predictable pricing
            </HomeHeading>
            <HomeDescription className=" w-full md:max-w-md md:text-center">
              Bring your ideas to life with interactive and evolving NFTs—no
              coding required. Our platform empowers creators to design.
            </HomeDescription>
          </div>
          <Pricing />
        </div>
        <div className="relative flex w-full flex-col items-center space-y-6 -xs:pt-12 pb-32 md:space-y-10">
          <div className="relative w-full md:max-w-xl">
            <div className="relative flex w-full flex-col space-y-2 pl-4 md:items-center">
              <HomeHeading className=" w-full -md:max-w-[18rem] md:max-w-[32rem] md:text-center">
                Made by Apes, with love
              </HomeHeading>
              <HomeDescription className="w-full md:max-w-md md:text-center">
                Bring your ideas to life with interactive and evolving NFTs—no
                coding required. Our platform empowers creators to design.
              </HomeDescription>
            </div>
            <Link
              href="https://madeby.boredapeyachtclub.com/bodega/CHGSEWJVFEGRAR"
              className="-top-[80px] xs:-top-[40px] md:-top-[20px] md:-right-[20px] absolute -md:left-64 rotate-12 opacity-70 transition-all duration-300 hover:rotate-0 hover:scale-110 hover:opacity-100"
            >
              <Image src="/home/MBA.svg" alt="MBA" width={80} height={80} />
            </Link>
          </div>
          <Team />
        </div>
        <div className=" flex w-full flex-col items-center justify-center pb-24">
          <div className="flex w-full max-w-5xl flex-col gap-12 rounded-home_mobile border border-border p-6 px-6 shadow-sm md:grid md:grid-cols-2 md:grid-rows-1 md:rounded-home md:p-12 lg:gap-6">
            <div className="flex flex-col justify-start gap-6 md:justify-between">
              <div className="flex flex-col gap-6">
                <div>
                  <h2 className="font-black font-mona text-4xl">
                    Join the beta
                  </h2>
                </div>
                <ul className="flex flex-col gap-2 pl-1">
                  <li
                    key="first"
                    className="flex gap-2 text-balance lg:items-center lg:gap-2"
                  >
                    <PiCheckTickCircleBrokenStroke className="mt-1 size-4 lg:mt-0" />
                    Be the first to try our studio
                  </li>
                  <li
                    key="personalized"
                    className="flex gap-2 text-balance lg:items-center lg:gap-2"
                  >
                    <PiCheckTickCircleBrokenStroke className="mt-1 size-4 lg:mt-0" />
                    Personalized support
                  </li>
                  <li
                    key="rewards"
                    className="flex gap-2 text-balance lg:items-center lg:gap-2"
                  >
                    <PiCheckTickCircleBrokenStroke className="mt-1 size-4 lg:mt-0" />
                    Exlusive rewards
                  </li>
                </ul>
              </div>
              <p className="hidden pl-2 text-muted-foreground text-xs md:block">
                Your inbox deserves to stay clean. <br /> We only send you the
                good stuff.
              </p>
            </div>
            <SignUpForm />
          </div>
        </div>
        {/*  <div className="flex w-full justify-center pt-20 pb-12">
          <div className=" flex w-full flex-col items-center space-y-6 md:max-w-5xl">
            <HomeHeading className="w-full max-w-2xl text-left">
              FAQs
            </HomeHeading>
            <Faqs />
          </div>
        </div> */}
      </main>
    </div>
  )
}
