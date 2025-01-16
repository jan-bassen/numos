import Link from 'next/link'
import SignUpDialog from '../sign-up-dialog'
import { ThemeToggle } from './theme-toggle'
import Logo from '@repo/ui/components/brand/logo'
import { buttonVariants } from '@repo/ui/components/ui/button'
import { cn } from '@repo/ui/lib/utils'

export default async function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-border bg-background px-4 py-4 sm:px-14 sm:py-6 ">
      <nav className="flex w-full items-center justify-between">
        <div className="flex items-center gap-8 md:gap-14">
          <Link href="/">
            <Logo className="!h-6 w-fit" />
          </Link>
        </div>

        <div className="flex w-fit items-center justify-end gap-3 font-bold">
          <>
            <Link
              href="https://studio.numos.xyz"
              className={cn(buttonVariants({ variant: 'ghost' }), 'px-3')}
            >
              Studio
            </Link>
            <SignUpDialog />
            <span className="hidden sm:block">
              <ThemeToggle />
            </span>
          </>
        </div>
        {/*         {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="sm:hidden h-full grid place-items-center pt-0.5 pr-1 "
          >
            {link.label}
          </Link>
        ))} */}
        {/*         <Drawer closeThreshold={0.15}>
          <DrawerTrigger asChild>
            <Button variant={"ghost"} className="sm:hidden p-2 h-fit">
              <PiBurgerMenuThreeStroke />
            </Button>
          </DrawerTrigger>
          <DrawerContent className="h-[50svh] items-center gap-8">
            <li className="gap-3 flex flex-col items-center text-xl font-medium font-hubot">
              <Link href="/blog" className="">
                Blog
              </Link>
              <Link href="/roadmap" className="">
                Roadmap
              </Link>
            </li>
          </DrawerContent>
        </Drawer> */}
      </nav>
    </header>
  )
}
