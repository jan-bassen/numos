import { Card, CardContent } from '@repo/ui/components/ui/card'
import { cn } from '@repo/ui/lib/utils'
import { LogicGraphic } from '@/app/(web)/(components)/highlights/logic-graphic'
import { ModularGraphic } from '@/app/(web)/(components)/highlights/modular-graphic'
import { ControlGraphic } from '@/app/(web)/(components)/highlights/control-graphic'
import { InfrastructureGraphic } from '@/app/(web)/(components)/highlights/infrastructure-graphic'

const cards = [
  {
    title: 'Create custom interactions visually',
    subtitle:
      'Bring your ideas to life with interactive and evolving NFTs—no coding required. Our platform empowers creators to design.',
    className: 'md:col-span-3 md:col-start-1 md:row-start-1',
    contentClassName: '-md:flex-col-reverse',
    headerClassName: '-md:pt-6 -md:pl-7',
    graphic: <LogicGraphic />,
  },
  {
    title: 'Modular design',
    subtitle:
      'We have big plans for the platform, so we designed it to be modular and easy to extend even for existing collections.',
    className: 'md:col-span-2 md:col-start-4 md:row-start-1',
    contentClassName: 'flex-col-reverse',
    headerClassName: 'pt-6 pl-7',
    graphic: <ModularGraphic />,
  },
  {
    title: 'Keep control of your assets',
    subtitle:
      'We do not take ownership of your assets. You keep full control over your assets.',
    className: 'md:col-span-2 md:col-start-1 md:row-start-2',
    contentClassName: '-md:flex-col-reverse',
    headerClassName: '-md:pt-6 -md:pl-7',
    graphic: <ControlGraphic />,
  },
  {
    title: 'Purpose built infrastructure',
    subtitle:
      'Our platform is designed to scale with your business. Sleep well knowing your data is safe and secure with no work on your part.',
    className: 'md:col-span-3 md:col-start-3 md:row-start-2',
    contentClassName: 'flex-col-reverse',
    headerClassName: 'pt-6 pl-7',
    graphic: <InfrastructureGraphic />,
  },
]

export function Highlights() {
  return (
    <div className="mx-auto grid w-full max-w-5xl grid-rows-4 gap-4 md:grid-cols-5 md:grid-rows-2">
      {cards.map((card) => (
        <HighlightsCard key={card.title} card={card} />
      ))}
    </div>
  )
}

function HighlightsCard({
  card,
  children,
}: { card: (typeof cards)[number]; children?: React.ReactNode }) {
  return (
    <Card
      className={cn(
        '!rounded-home_mobile lg:!rounded-home h-80 overflow-hidden md:col-span-3 md:col-start-1 md:row-start-1 md:h-80',
        card.className,
      )}
    >
      <CardContent
        className={cn('flex h-full flex-col gap-1 p-0', card.contentClassName)}
      >
        <div className="h-full w-full">{card.graphic}</div>
        <div
          className={cn(
            '!shrink-0 z-10 flex h-fit flex-col gap-1 px-5 pt-0 pb-5',
            card.headerClassName,
          )}
        >
          <span className="font-semibold text-lg">{card.title}</span>
          <span className="text-muted-foreground text-sm leading-tight">
            {card.subtitle}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
