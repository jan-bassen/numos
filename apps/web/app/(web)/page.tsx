import { Hero } from '@/app/(web)/(components)/hero/hero'
import { Example } from '@/app/(web)/(components)/example'
import { HomeDescription, HomeHeading } from '@/app/(web)/(components)/heading'
import { Architecture } from '@/app/(web)/(components)/architecture/architecture'
import { Highlights } from '@/app/(web)/(components)/highlights/highlights'
import { Pricing } from '@/app/(web)/(components)/pricing'
import { Team } from '@/app/(web)/(components)/team'
import Image from 'next/image'
import Link from 'next/link'
import SignUpForm from '@/components/sign-up/sign-up-form'
import { PiCheckTickCircleBrokenStroke } from '@repo/ui/icons/pika'
import { getDictionary } from '@/dictionaries/dictionaries'
import { Tweets } from '@/app/(web)/(components)/tweets/tweets'
import type { Metadata } from 'next'

export default async function Home() {
  const d = await getDictionary('en')
  return (
    <div className="relative flex w-full flex-col items-center">
      <Hero dictionary={d.home} />
      <main className="relative w-full overflow-visible px-4 pt-20 pb-52 md:px-8 xl:px-0">
        <Tweets />
        {/* <Example dictionary={d.home.example} /> */}
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
        <Architecture dictionary={d.home.architecture} />
        <div className="md:!mt-6 relative flex w-full flex-col items-center space-y-6 pb-32 md:space-y-10">
          <div className="w-full max-w-5xl space-y-2 pl-3 md:pl-4">
            <HomeHeading className="w-full max-w-lg">
              {d.home.highlights.title}
            </HomeHeading>
            <HomeDescription className="w-full max-w-xl">
              {d.home.highlights.description}
            </HomeDescription>
          </div>
          <Highlights dictionary={d.home.highlights} />
        </div>
        <div className="relative flex w-full flex-col items-center space-y-6 pb-32 md:space-y-10">
          <div className="flex w-full flex-col space-y-4 pl-4 sm:items-center">
            <HomeHeading className="w-full md:max-w-2xl md:text-center">
              {d.home.pricing.title}
            </HomeHeading>
            <HomeDescription className=" w-full md:max-w-lg md:text-center">
              {d.home.pricing.description}
            </HomeDescription>
          </div>
          <Pricing dictionary={d.home.pricing} />
        </div>
        <div className="relative flex w-full flex-col items-center space-y-6 max-xs:pt-12 pb-32 md:space-y-10">
          <div className="relative w-full md:max-w-xl">
            <div className="relative flex w-full flex-col space-y-2 pl-4 md:items-center">
              <HomeHeading className=" w-full max-md:max-w-[18rem] md:max-w-[32rem] md:text-center">
                {d.home.team.title}
              </HomeHeading>
              <HomeDescription className="w-full md:max-w-md md:text-center">
                {d.home.team.description}
              </HomeDescription>
            </div>
            <Link
              href="https://madeby.boredapeyachtclub.com/bodega/CHGSEWJVFEGRAR"
              className="-top-[60px] xs:-top-[40px] md:-top-[20px] md:-right-[20px] absolute max-md:left-64 rotate-12 opacity-70 transition-all duration-300 hover:rotate-0 hover:scale-110 hover:opacity-100"
            >
              <Image src="/assets/mba.svg" alt="MBA" width={80} height={80} />
            </Link>
          </div>
          <Team dictionary={d.home.team} />
        </div>
        <div className=" flex w-full flex-col items-center justify-center pb-12 sm:pb-24">
          <div className="flex w-full max-w-5xl flex-col gap-12 rounded-2xl border border-border p-6 px-6 shadow-xs md:grid md:grid-cols-2 md:grid-rows-1 md:rounded-4xl md:p-12 lg:gap-6">
            <div className="flex flex-col justify-start gap-6 md:justify-between">
              <div className="flex flex-col gap-6">
                <div>
                  <h2 className="font-black font-mona text-4xl">
                    {d.home.beta.title}
                  </h2>
                </div>
                <ul className="flex flex-col gap-2 pl-1">
                  {d.home.beta.benefits.map((benefit) => (
                    <li
                      key={benefit}
                      className="flex gap-2 text-balance lg:items-center lg:gap-2"
                    >
                      <PiCheckTickCircleBrokenStroke className="mt-1 size-4 lg:mt-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
              <p className="hidden pl-2 text-muted-foreground text-xs md:block">
                {d.home.beta.disclaimer}
              </p>
            </div>
            <SignUpForm dictionary={d.home.beta} />
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
