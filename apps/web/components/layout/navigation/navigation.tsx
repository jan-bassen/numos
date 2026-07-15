import Logo from '@repo/ui/blocks/brand/logo'
import { Button } from '@repo/ui/components/button'
import Link from 'next/link'
import { ThemeToggle } from '@/components/layout/navigation/theme-toggle'
import type { Dictionary } from '@/dictionaries/dictionaries'
import { getStudioUrl } from '@/lib/urls'

export function Navigation({
  dictionary,
}: {
  dictionary: Dictionary['navbar']
}) {
  const studioUrl = getStudioUrl()

  return (
    <div className="fixed z-[60] h-14 w-full max-w-[82rem] border border-muted bg-gradient-to-b from-sidebar/90 to-border/90 shadow-md outline outline-2 outline-border backdrop-blur-xs md:top-4 md:w-[calc(100%-3rem)] md:rounded-full 2xl:w-full">
      <div className="flex h-full items-center justify-between px-2 sm:px-3">
        <div className="flex h-full items-center gap-12">
          <Link href="/" className="flex items-center gap-1.5 max-md:pl-1">
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
          <Button asChild className="mr-1 rounded-full">
            <Link href={studioUrl}>{dictionary.cta}</Link>
          </Button>
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
            <PopoverContent className="min-h-60 w-screen rounded-none border-0 border-b bg-sidebar/90 px-4 py-6 shadow-xs backdrop-blur-xs" />
          </Popover> */}
        </div>
      </div>
    </div>
  )
}
