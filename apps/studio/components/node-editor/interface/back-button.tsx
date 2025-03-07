import { buttonVariants } from '@repo/ui/components/ui/button'
import { PiChevronBigLeftStroke } from '@repo/ui/icons/pika'
import { cn } from '@repo/ui/lib/utils'
import Link from 'next/link'

export default function BackButton({ parentUrl }: { parentUrl?: string }) {
  if (!parentUrl) return null
  return (
    <Link
      href={parentUrl}
      className={cn(
        buttonVariants({ variant: 'outline' }),
        'h-9 items-center gap-1 rounded-lg pr-3 pl-2 shadow-xs md:h-10',
      )}
    >
      <PiChevronBigLeftStroke className="size-4.5" />
      Back
    </Link>
  )
}
