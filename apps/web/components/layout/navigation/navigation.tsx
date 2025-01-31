import Logo from '@repo/ui/components/brand/logo'
import { PiBurgerMenuThreeStroke, PiSunStroke } from '@repo/ui/icons/pika'
import { Button } from '@repo/ui/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@repo/ui/components/ui/popover'
import { Link } from '@repo/ui/components/ui/link'

import { buttonVariants } from '@repo/ui/components/ui/button'
import { cn } from '@repo/ui/lib/utils'
import { ThemeToggle } from '@/components/layout/navigation/theme-toggle'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogHeader,
  DialogTrigger,
} from '@repo/ui/components/ui/dialog'
import SignUpForm from '@/components/sign-up/sign-up-form'
import type { Dictionary } from '@/dictionaries/dictionaries'

export function Navigation({
  dictionary,
}: {
  dictionary: {
    navbar: Dictionary['navbar']
    beta: Dictionary['home']['beta']
  }
}) {
  return (
    <div className="fixed z-60 h-12 w-full max-w-[82rem] border border-muted bg-gradient-to-b from-sidebar/90 to-border/90 shadow-md outline outline-2 outline-border backdrop-blur-sm sm:h-14 md:top-4 md:w-[calc(100%-3rem)] md:rounded-full 2xl:w-full">
      <div className="flex h-full items-center justify-between px-2 sm:px-3">
        <div className="flex h-full items-center gap-12">
          <Link href="/" className="flex items-center gap-1.5 -md:pl-1">
            <Logo className="size-6 sm:size-10" name />
          </Link>
          <div className="hidden gap-6 md:flex">
            {/* <Link href="/docs" effect="hoverUnderline">
              Docs
            </Link> */}
            {/*             <Link href="/pricing" effect="hoverUnderline">
              Pricing
            </Link> */}
          </div>
        </div>
        <div className="flex h-full items-center gap-2">
          <ThemeToggle />
          <Link
            href="https://studio.numos.xyz/login"
            className={cn(
              buttonVariants({ variant: 'ghost' }),
              '-sm:!hidden rounded-full',
            )}
          >
            {dictionary.navbar.login}
          </Link>
          <Dialog>
            <DialogTrigger asChild>
              <Button effect="ringHover" className="mr-1 -sm:h-8 rounded-full">
                {dictionary.navbar.signup}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] sm:rounded-home_mobile sm:px-10 sm:py-8 md:max-w-[500px]">
              <DialogHeader className="space-y-0.5 pb-2">
                <DialogTitle className="w-full text-left font-bold text-2xl">
                  {dictionary.beta.modalTitle}
                </DialogTitle>
                <DialogDescription className="w-full text-left text-sm">
                  {dictionary.beta.modalDescription}
                </DialogDescription>
              </DialogHeader>
              <SignUpForm dictionary={dictionary.beta} />
            </DialogContent>
          </Dialog>
          {/* <Popover>
            <PopoverTrigger asChild>
              <Button
                effect={'ringHover'}
                variant="none"
                size="none"
                className="size-10 bg-transparent p-2 md:hidden"
              >
                <PiBurgerMenuThreeStroke className="size-6" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="min-h-60 w-screen rounded-none border-0 border-b bg-sidebar/90 px-4 py-6 shadow-sm backdrop-blur-sm" />
          </Popover> */}
        </div>
      </div>
    </div>
  )
}
