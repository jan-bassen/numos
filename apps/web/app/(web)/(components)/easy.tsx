import { Card, CardContent } from '@repo/ui/components/ui/card'
import { cn } from '@repo/ui/lib/utils'

const cards = [
  {
    title: 'No code required',
    description:
      'Bring your ideas to life with interactive and evolving NFTs—no coding required. Our platform empowers creators to design.',
    className: 'md:col-span-3 md:col-start-1 md:row-start-1',
  },
  {
    title: 'Secure',
    description:
      'Sleep well knowing your data is safe and secure with no work on your part.',
    className: 'md:col-span-2 md:col-start-4 md:row-start-1',
  },
  {
    title: 'Scalable',
    description: 'Our platform is designed to scale with your business.',
    className: 'md:col-span-2 md:col-start-1 md:row-start-2',
  },
  {
    title: 'Keep your assets',
    description:
      'We do not take ownership of your assets. You keep full control over your assets.',
    className: 'md:col-span-3 md:col-start-3 md:row-start-2',
  },
]

export function Easy() {
  return (
    <div className="mx-auto grid w-full max-w-5xl grid-rows-4 gap-4 md:grid-cols-5 md:grid-rows-2">
      {cards.map((card) => (
        <EasyCard key={card.title} card={card} />
      ))}
    </div>
  )
}

function EasyCard({ card }: { card: (typeof cards)[number] }) {
  return (
    <Card
      className={cn(
        'h-52 !rounded-home_mobile md:col-span-3 md:col-start-1 md:row-start-1 md:h-80 lg:!rounded-home',
        card.className,
      )}
    >
      <CardContent className="flex h-full items-center justify-center p-6">
        <span className="text-muted-foreground">{card.title}</span>
      </CardContent>
    </Card>
  )
}
