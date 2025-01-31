import { cn } from '@repo/ui/lib/utils'
import Image from 'next/image'

export function InfrastructureGraphic() {
  return (
    <div className="relative size-full overflow-hidden bg-gradient-to-b from-muted/30 to-background md:bg-gradient-to-t">
      {/* <BigChip className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2" />
      <Chip className="-translate-x-[calc(50%+180px)] -translate-y-[calc(50%-30px)] absolute top-1/2 left-1/2" /> */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-background via-30% via-background/30 to-background/95 md:bg-gradient-to-b" />
      <Image
        src="/assets/infrastructure.svg"
        alt="Infrastructure"
        width={800}
        height={400}
        className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 dark:hidden"
      />
      <Image
        src="/assets/infrastructure-dark.svg"
        alt="Infrastructure"
        width={800}
        height={400}
        className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 hidden dark:block"
      />
    </div>
  )
}

function BigChip({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'relative size-18 rounded-md bg-gradient-to-b from-muted to-muted/30 ring-2 ring-border-highlight',
        className,
      )}
    >
      {/* left */}
      <div className="-translate-x-3 -translate-y-1/2 absolute top-1/2 left-0 w-3 space-y-2">
        <div className="h-1 w-full rounded-l-full bg-border-highlight" />
        <div className="h-1 w-full rounded-l-full bg-border-highlight" />
        <div className="h-1 w-full rounded-l-full bg-border-highlight" />
        <div className="h-1 w-full rounded-l-full bg-border-highlight" />
        <div className="h-1 w-full rounded-l-full bg-border-highlight" />
      </div>
      {/* right */}
      <div className="-translate-y-1/2 absolute top-1/2 right-0 w-3 translate-x-3 space-y-2">
        <div className="h-1 w-full rounded-r-full bg-border-highlight" />
        <div className="h-1 w-full rounded-r-full bg-border-highlight" />
        <div className="h-1 w-full rounded-r-full bg-border-highlight" />
        <div className="h-1 w-full rounded-r-full bg-border-highlight" />
        <div className="h-1 w-full rounded-r-full bg-border-highlight" />
      </div>
      {/* bottom */}
      <div className="-translate-x-1/2 absolute bottom-0 left-1/2 flex h-3 translate-y-3 space-x-2">
        <div className="h-full w-1 rounded-b-full bg-border-highlight" />
        <div className="h-full w-1 rounded-b-full bg-border-highlight" />
        <div className="h-full w-1 rounded-b-full bg-border-highlight" />
        <div className="h-full w-1 rounded-b-full bg-border-highlight" />
        <div className="h-full w-1 rounded-b-full bg-border-highlight" />
      </div>
      {/* top */}
      <div className="-translate-x-1/2 -translate-y-3 absolute top-0 left-1/2 flex h-3 space-x-2">
        <div className="h-full w-1 rounded-t-full bg-border-highlight" />
        <div className="h-full w-1 rounded-t-full bg-border-highlight" />
        <div className="h-full w-1 rounded-t-full bg-border-highlight" />
        <div className="h-full w-1 rounded-t-full bg-border-highlight" />
        <div className="h-full w-1 rounded-t-full bg-border-highlight" />
      </div>
    </div>
  )
}

function Chip({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'relative size-12 rounded-md bg-gradient-to-b from-muted to-muted/30 ring-2 ring-border-highlight',
        className,
      )}
    >
      {/* left */}
      <div className="-translate-x-2 -translate-y-1/2 absolute top-1/2 left-0 w-2 space-y-1.5">
        <div className="h-1 w-full rounded-l-full bg-border-highlight" />
        <div className="h-1 w-full rounded-l-full bg-border-highlight" />
        <div className="h-1 w-full rounded-l-full bg-border-highlight" />
        <div className="h-1 w-full rounded-l-full bg-border-highlight" />
      </div>
      {/* right */}
      <div className="-translate-y-1/2 absolute top-1/2 right-0 w-2 translate-x-2 space-y-1.5">
        <div className="h-1 w-full rounded-r-full bg-border-highlight" />
        <div className="h-1 w-full rounded-r-full bg-border-highlight" />
        <div className="h-1 w-full rounded-r-full bg-border-highlight" />
        <div className="h-1 w-full rounded-r-full bg-border-highlight" />
      </div>
      {/* bottom */}
      <div className="-translate-x-1/2 absolute bottom-0 left-1/2 flex h-2 translate-y-2 space-x-1.5">
        <div className="h-full w-1 rounded-b-full bg-border-highlight" />
        <div className="h-full w-1 rounded-b-full bg-border-highlight" />
        <div className="h-full w-1 rounded-b-full bg-border-highlight" />
        <div className="h-full w-1 rounded-b-full bg-border-highlight" />
      </div>
      {/* top */}
      <div className="-translate-x-1/2 -translate-y-2 absolute top-0 left-1/2 flex h-2 space-x-1.5">
        <div className="h-full w-1 rounded-t-full bg-border-highlight" />
        <div className="h-full w-1 rounded-t-full bg-border-highlight" />
        <div className="h-full w-1 rounded-t-full bg-border-highlight" />
        <div className="h-full w-1 rounded-t-full bg-border-highlight" />
      </div>
    </div>
  )
}
