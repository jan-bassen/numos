import Logo from '@repo/ui/components/brand/logo'
import { PiBurgerMenuThreeStroke } from '@repo/ui/icons/pika'
import { Button } from '@repo/ui/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@repo/ui/components/ui/popover'
import Link from 'next/link'
import { buttonVariants } from '@repo/ui/components/ui/button'
import { cn } from '@repo/ui/lib/utils'

export function Navigation() {
  return (
    <div className="fixed z-60 h-14 w-full max-w-[82rem] border border-muted bg-sidebar/80 shadow-sm backdrop-blur-sm md:top-4 md:w-[calc(100%-3rem)] md:rounded-full 2xl:w-full">
      <div className="flex h-full items-center justify-between px-2 sm:px-3">
        <div className="flex h-full items-center gap-12">
          <Link href="/" className="flex items-center gap-1.5 -md:pl-1">
            <Logo className="size-10" name />
          </Link>
          <div className="hidden gap-6 md:flex">
            <Link href="/docs" className="hover:underline">
              Docs
            </Link>
            <Link href="/pricing" className="hover:underline">
              Pricing
            </Link>
          </div>
        </div>
        <div className="flex h-full items-center gap-2">
          <Link
            href="https://studio.numos.xyz/login"
            className={cn(
              buttonVariants({ variant: 'ghost' }),
              '-sm:!hidden rounded-full',
            )}
          >
            Log in
          </Link>
          <Link
            href="https://studio.numos.xyz/signup"
            className={cn(buttonVariants({}), 'mr-1 -2xs:hidden rounded-full')}
          >
            Sign up
          </Link>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="none"
                size="none"
                className="size-10 bg-transparent p-2 md:hidden"
              >
                <PiBurgerMenuThreeStroke className="size-6" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="min-h-60 w-screen rounded-none border-0 border-b bg-sidebar/90 px-4 py-6 shadow-sm backdrop-blur-sm" />
          </Popover>
        </div>
      </div>
    </div>
  )
}
