'use client'

import { Button, buttonVariants } from '@repo/ui/components/button'
import {
  PiChevronBigLeftStroke,
  PiChevronLeftStroke,
} from '@repo/ui/icons/pika'
import { cn } from '@repo/ui/lib/utils'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function NotFound() {
  const router = useRouter()
  return (
    <div className="grid h-screen w-full place-items-center ">
      <div className="flex w-full flex-col items-center p-2 sm:p-0 md:w-96 md:items-start">
        <h1 className="pl-2 text-7xl font-extrabold">404</h1>
        <p className="p-2 text-center text-lg md:text-left">
          This page doesn&apos;t seem to exist
        </p>
        <div className="flex w-full justify-end gap-2 pt-10">
          <Button className="gap-1.5 pl-3" onClick={() => router.back()}>
            <PiChevronBigLeftStroke className="size-4" />
            Back
          </Button>
          <Link className={cn(buttonVariants({ variant: 'outline' }))} href="/">
            Homepage
          </Link>
          <Link className={cn(buttonVariants({ variant: 'outline' }))} href="/">
            Studio
          </Link>
        </div>
      </div>
    </div>
  )
}
