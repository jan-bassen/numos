import { buttonVariants } from '@repo/ui/components/ui/button'
import { PiBugStroke, PiChevronBigLeftStroke } from '@repo/ui/icons/pika'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export default function AuthCodeErrorPage() {
  return (
    <div className="m-auto flex flex-col gap-6">
      <div className="space-y-2 pl-3">
        <h1 className="text-4xl font-bold">Oh no...</h1>
        <div className="mx-auto flex flex-row gap-2">
          <h2 className="text-lg font-medium">Something went wrong!</h2>
          <PiBugStroke className="my-auto size-5" />
        </div>
      </div>
      <div className="flex w-full justify-end gap-2">
        <Link href={'/'} className={cn(buttonVariants(), 'flex gap-2')}>
          <PiChevronBigLeftStroke className="size-4" />
          Studio
        </Link>
      </div>
    </div>
  )
}
