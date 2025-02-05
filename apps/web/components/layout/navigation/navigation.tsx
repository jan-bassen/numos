import Logo from '@repo/ui/components/brand/logo'
import { Button } from '@repo/ui/components/ui/button'
import { Link } from '@repo/ui/components/ui/link'
import { buttonVariants } from '@repo/ui/components/ui/button'
import { cn } from '@repo/ui/lib/utils'
import { ThemeToggle } from '@/components/layout/navigation/theme-toggle'
import type { Dictionary } from '@/dictionaries/dictionaries'
import { SignUpDialog } from '@/components/sign-up/sign-up-dialog'

export function Navigation({
  dictionary,
}: {
  dictionary: {
    navbar: Dictionary['navbar']
    home: Dictionary['home']
  }
}) {
  return (
    <div className="fixed z-60 h-14 w-full max-w-[82rem] border border-muted bg-gradient-to-b from-sidebar/90 to-border/90 shadow-md outline outline-2 outline-border backdrop-blur-sm md:top-4 md:w-[calc(100%-3rem)] md:rounded-full 2xl:w-full">
      <div className="flex h-full items-center justify-between px-2 sm:px-3">
        <div className="flex h-full items-center gap-12">
          <Link href="/" className="flex items-center gap-1.5 -md:pl-1">
            <Logo className="h-7 sm:h-8" size={200} name />
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
          <SignUpDialog dictionary={dictionary.home}>
            <Button effect="ringHover" className="mr-1 rounded-full">
              {dictionary.navbar.signup}
            </Button>
          </SignUpDialog>
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
