import { Button } from '@repo/ui/components/ui/button'
import { PiArrowRightStroke } from '@repo/ui/icons/pika'

export function Hero() {
  return (
    <div className="relative h-[55svh] w-full bg-foreground">
      <div className="size-full bg-gradient-to-t from-grid/95 to-grid" />
      <Button className="-translate-x-1/2 absolute bottom-0 left-1/2 z-10 flex h-10 translate-y-1/2 items-center gap-2 rounded-full px-10">
        Start creating
        <PiArrowRightStroke className="size-4" />
      </Button>
    </div>
  )
}
