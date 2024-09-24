import Link from 'next/link'
import SignUpDialog from '../sign-up-dialog'
import { ThemeToggle } from './theme-toggle'
import Logo from '@repo/ui/components/brand/logo'
import { buttonVariants } from '@repo/ui/components/ui/button'
import { cn } from '@/lib/utils'
import type { User } from '@supabase/supabase-js'
import UserButton from '@/components/user/user-button'
import type { Profile } from '@/types/database.types'
import { getProfile } from '@/lib/supabase/db/profile'

export default async function Navbar({ user }: { user: User | null }) {
  let profile: Profile | undefined
  if (user) {
    profile = await getProfile(user.id)
  }
  return (
    <header className="sticky top-0 z-40 w-full border-border bg-background px-4 py-4 sm:px-14 sm:py-6 ">
      <nav className="flex w-full items-center justify-between">
        <div className="flex items-center gap-8 md:gap-14">
          <Link href="/">
            <Logo size={90} className="size-8" />
          </Link>
          {/* <ul className="flex gap-4 pt-0.5 font-medium md:gap-10">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:underline"
              >
                {link.label}
              </Link>
            ))}
          </ul> */}
        </div>

        {!user?.id ||
          (!profile && (
            <span className="hidden sm:block">
              <ThemeToggle />
            </span>
          ))}
        <div className="flex w-fit items-center justify-end gap-3 font-bold">
          {user?.id && profile ? (
            <>
              <Link
                href="/studio"
                className={cn(buttonVariants({ variant: 'ghost' }), 'px-3')}
              >
                Go to Studio
              </Link>
              <UserButton type="header" user={user} profile={profile} />
            </>
          ) : (
            <>
              <Link
                href="/studio"
                className={cn(buttonVariants({ variant: 'ghost' }), 'px-3')}
              >
                Login
              </Link>
              <SignUpDialog />
            </>
          )}
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
