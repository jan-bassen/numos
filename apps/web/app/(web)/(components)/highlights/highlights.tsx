import { Card, CardContent } from '@repo/ui/components/card'
import { cn } from '@repo/ui/lib/utils'
import { LogicGraphic } from '@/app/(web)/(components)/highlights/logic-graphic'
import { ModularGraphic } from '@/app/(web)/(components)/highlights/modular-graphic'
import { ControlGraphic } from '@/app/(web)/(components)/highlights/control-graphic'
import { InfrastructureGraphic } from '@/app/(web)/(components)/highlights/infrastructure-graphic'
import type { Dictionary } from '@/dictionaries/dictionaries'

export function Highlights({
  dictionary,
}: {
  dictionary: Dictionary['home']['highlights']
}) {
  const cards = [
    {
      title: dictionary.visualEditor.title,
      subtitle: dictionary.visualEditor.description,
      className: 'md:col-span-3 md:col-start-1 md:row-start-1',
      contentClassName: 'max-md:flex-col-reverse',
      headerClassName: 'max-md:pt-6 max-md:pl-7',
      graphic: <LogicGraphic />,
    },
    {
      title: dictionary.modular.title,
      subtitle: dictionary.modular.description,
      className: 'md:col-span-2 md:col-start-4 md:row-start-1',
      contentClassName: 'flex-col-reverse',
      headerClassName: 'pt-6 pl-7',
      graphic: <ModularGraphic />,
    },
    {
      title: dictionary.control.title,
      subtitle: dictionary.control.description,
      className: 'md:col-span-2 md:col-start-1 md:row-start-2',
      contentClassName: 'max-md:flex-col-reverse',
      headerClassName: 'max-md:pt-6 max-md:pl-7',
      graphic: <ControlGraphic />,
    },
    {
      title: dictionary.infrastructure.title,
      subtitle: dictionary.infrastructure.description,
      className: 'md:col-span-3 md:col-start-3 md:row-start-2',
      contentClassName: 'flex-col-reverse',
      headerClassName: 'pt-6 pl-7',
      graphic: <InfrastructureGraphic />,
    },
  ]

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
}: {
  card: {
    title: string
    subtitle: string
    className: string
    contentClassName: string
    headerClassName: string
    graphic: React.ReactNode
  }
  children?: React.ReactNode
}) {
  return (
    <Card
      className={cn(
        '!rounded-2xl lg:!rounded-4xl h-80 overflow-hidden md:col-span-3 md:col-start-1 md:row-start-1 md:h-80',
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
