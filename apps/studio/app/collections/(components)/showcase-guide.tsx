import { Button } from '@repo/ui/components/button'
import { cn } from '@repo/ui/lib/utils'
import {
  ArrowRight,
  Braces,
  ImageIcon,
  type LucideIcon,
  Play,
  Upload,
} from 'lucide-react'
import Link from 'next/link'

const showcaseLinks = [
  {
    title: 'Action node editor',
    description: 'Follow how Water changes the flower state.',
    href: '/collections/bloom-lab/actions/water/logic',
    icon: Play,
  },
  {
    title: 'Image node editor',
    description: 'See how attributes select the rendered artwork.',
    href: '/collections/bloom-lab/image/living-flower/logic',
    icon: ImageIcon,
  },
  {
    title: 'Attributes',
    description: 'Inspect the state that drives the collection.',
    href: '/collections/bloom-lab/attributes',
    icon: Braces,
  },
  {
    title: 'Upload library',
    description: 'Browse the artwork available to image logic.',
    href: '/collections/bloom-lab/uploads',
    icon: Upload,
  },
] as const satisfies ReadonlyArray<{
  title: string
  description: string
  href: string
  icon: LucideIcon
}>

export function ShowcaseGuide() {
  return (
    <section
      aria-label="Showcase guide"
      className="mt-2 overflow-hidden rounded-xl border bg-gradient-to-br from-muted/50 via-background to-primary-50/40"
      data-testid="showcase-guide"
    >
      <div className="grid gap-8 p-6 md:p-7 lg:grid-cols-[minmax(0,0.9fr)_minmax(28rem,1.1fr)] lg:gap-12">
        <div className="flex max-w-xl flex-col items-start">
          <p className="mb-3 font-semibold text-primary-700 text-xs uppercase tracking-wider">
            Start here
          </p>
          <h2 className="text-balance font-semibold text-xl tracking-tight md:text-2xl">
            See how a living collection is built
          </h2>
          <p className="mt-3 text-pretty text-muted-foreground text-sm leading-6">
            Numos Studio is a no-code workspace for dynamic digital assets.
            Attributes hold state, actions change it, and image logic turns it
            into artwork. Everything in this demo is editable and stored locally
            in your browser.
          </p>
          <p className="mt-4 text-sm leading-6">
            Try opening the Flower Demo, running an action, then changing a node
            and running it again.
          </p>
          <Button asChild className="mt-5">
            <Link href="/collections/bloom-lab">
              Open Flower Demo
              <ArrowRight />
            </Link>
          </Button>
        </div>

        <div>
          <p className="mb-3 font-medium text-sm">Jump into the demo</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {showcaseLinks.map((item) => {
              const Icon = item.icon

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'group flex min-h-24 gap-3 rounded-lg border bg-background/80 p-4 shadow-xs',
                    'transition-colors hover:border-primary-200 hover:bg-primary-50/40',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                  )}
                >
                  <div className="grid size-8 shrink-0 place-items-center rounded-md bg-muted text-muted-foreground transition-colors group-hover:bg-primary-100 group-hover:text-primary-700">
                    <Icon className="size-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 font-semibold text-sm">
                      <span>{item.title}</span>
                      <ArrowRight className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                    </div>
                    <p className="mt-1 text-muted-foreground text-xs leading-5">
                      {item.description}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
