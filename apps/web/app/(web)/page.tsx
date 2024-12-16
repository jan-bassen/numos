import Headline from '@/components/landing-page/headline'
import Explainer from '@/components/landing-page/explainer'
import Hero, { Hero2 } from '@/components/landing-page/hero'
import MadeByApes from '@/components/landing-page/made-by-apes'
import SignUpForm from '@/components/landing-page/sign-up-form'
import TweetCarousel from '@/components/landing-page/tweet-carousel'
import { AnimateIn, AnimateOnScroll } from '@/components/animation/animate-in'
import Faqs from '@/components/landing-page/faqs'
import OrbitGraphic from '@/components/landing-page/orbit-graphic'
import EditorGraphic from '@/components/landing-page/editor-graphic'
import Intro from '@/components/landing-page/intro'
import Navbar from '@/components/landing-page/nav/navbar'
import Footer from '@/components/landing-page/nav/footer'

export default async function Home() {
  return (
    <div className="mx-auto max-w-[1240px]">
      {/* <Navbar /> */}
      <div>
        <AnimateIn className="pb-32 md:pb-52">
          <Hero />
        </AnimateIn>
        <main className="mx-auto flex max-w-[1080px] flex-col justify-start gap-20 px-8 pb-48 md:gap-52">
          <AnimateOnScroll>
            <Intro />
          </AnimateOnScroll>
          <div className="flex flex-col gap-24">
            <AnimateOnScroll>
              <Hero2 />
            </AnimateOnScroll>
            <AnimateOnScroll>
              <Explainer
                side="right"
                title="Turn collectors into active participants"
                description="Rethink how your customers interact with your assets. Reprogram them with fun and encouraging utilities. 
              Reward exploration with exciting unlocks that make collectors bond and feel more involved."
                box={
                  <div className="grid h-96 w-full place-items-center">
                    <OrbitGraphic />
                  </div>
                }
              />
            </AnimateOnScroll>
            <AnimateOnScroll>
              <Explainer
                side="left"
                title="Focus on your vision, not the tech"
                description="Creating next-generation digital assets has never been this easy. We integrate into your existing product and free you of the burden of developmen, whether you're a solo artist or a larger team."
                box={<EditorGraphic />}
              />
            </AnimateOnScroll>
          </div>
          <AnimateOnScroll>
            <SignUpForm />
          </AnimateOnScroll>
          <AnimateOnScroll>
            <MadeByApes />
          </AnimateOnScroll>
          <AnimateOnScroll>
            <Headline
              title="You're in good company"
              description="If you think dynamic & interactive NFTs are a great opportunity, you're not alone"
            />
            <TweetCarousel />
          </AnimateOnScroll>
          <AnimateOnScroll>
            <Headline
              title="Frequently Asked Questions"
              description="For anything else, just shoot us a message!"
            />
            <Faqs />
          </AnimateOnScroll>
          <AnimateOnScroll>
            <SignUpForm />
          </AnimateOnScroll>
        </main>
      </div>
      <Footer />
    </div>
  )
}
