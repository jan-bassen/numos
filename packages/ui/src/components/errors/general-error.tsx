'use client'

import { Button, buttonVariants } from '@repo/ui/components/ui/button'
import {
  PiBugStroke,
  PiChevronBigLeftStroke,
  PiRefreshStroke,
} from '@repo/ui/icons/pika'
import { cn } from '@repo/ui/lib/utils'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function GeneralError(props: {
  resetFunction: () => void
  error: Error
  className?: string
}) {
  const { error, className } = props
  const router = useRouter()
  return (
    <div
      className={cn(
        'm-auto flex h-screen w-full flex-col items-center justify-center gap-6',
        className,
      )}
    >
      <div className="space-y-2 pl-3">
        <h1 className="font-bold text-4xl">Oh no...</h1>
        <div className="mx-auto flex flex-row gap-2">
          <h2 className="font-medium text-lg">Something went wrong!</h2>
          <PiBugStroke className="my-auto size-5" />
        </div>
      </div>
      <p className="scrollbar-none line-clamp-5 w-fit min-w-96 max-w-[50rem] overflow-x-hidden overflow-y-scroll rounded-md border border-border px-4 py-3 text-xs">
        {error.message}
      </p>
      <div className="flex w-fit gap-2">
        <Link
          href={'/collections'}
          className={cn(buttonVariants({ variant: 'ghost' }), 'flex gap-2')}
        >
          <PiChevronBigLeftStroke className="size-4" />
          Studio
        </Link>
        {/*  <Button
          variant={'ghost'}
          className="flex w-32 gap-2"
          onClick={() => resetFunction}
        >
          <PiRefreshStroke className="size-4" />
          Retry
        </Button> */}
        <Button className="flex w-40 gap-2" onClick={() => router.refresh()}>
          <PiRefreshStroke className="size-4" />
          Refresh page
        </Button>
      </div>
    </div>
  )
}
