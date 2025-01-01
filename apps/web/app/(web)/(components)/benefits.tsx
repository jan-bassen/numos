import { cn } from '@repo/ui/lib/utils'

const benefits = [
  {
    title: 'Commemoration',
    description:
      'Create a permanent record of your users achievements and experiences.',
  },
  {
    title: 'Co-Creation',
    description:
      'Make your users feel like they are part of the project. Give them a sense of ownership and involvement.',
  },
  {
    title: 'Progression',
    description:
      'Encourage users to take their time and explore the project. Provide opportunities for them to learn and grow.',
  },
  {
    title: 'Rewards',
    description:
      'Offer incentives and rewards to encourage users to engage with your project. This can be in the form of in-game items, virtual currency, or other rewards.',
  },
  {
    title: 'Gamification',
    description:
      'Add a competitive element to your project. This can be in the form of leaderboards, rankings, or other gamification features.',
  },
  {
    title: 'Customization',
    description:
      'Allow users to customize their experience. This can be in the form of different levels, skins, or other customization options.',
  },
  {
    title: 'Storytelling',
    description:
      'Use your project to tell a compelling story. This can be in the form of narratives, dialogues, or other storytelling elements.',
  },
]

export function Benefits() {
  return (
    <div className="group flex -md:h-[36rem] w-full max-w-5xl -md:flex-col items-center">
      {benefits.map((benefit, i) => (
        <div
          key={benefit.title}
          className={cn(
            'relative w-full flex-[0.14285714] -md:py-1 transition-all duration-300 hover:flex-[0.7] md:px-2',
            i === 0 &&
              '-md:hover:!flex-[0.7] -md:flex-[0.7] -md:group-hover:flex-[0.14285714]',
            i === 3 &&
              'md:hover:!flex-[0.7] md:flex-[0.7] md:group-hover:flex-[0.14285714]',
          )}
        >
          <div className="h-full rounded-home_mobile md:rounded-home border border-border bg-muted md:h-[28rem]" />
        </div>
      ))}
    </div>
  )
}
