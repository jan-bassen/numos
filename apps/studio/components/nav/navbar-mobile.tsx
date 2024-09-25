import { cn } from '@/lib/utils'
import CollectionPicker from './collection-picker'
import type { Collection, Profile } from '@/types/database.types'
import UserButton from '../user/user-button'
import { MobileNavbarLinks } from './navbar-links'
import { PiChevronRightStroke } from '@repo/ui/icons/pika'
import Link from 'next/link'
import Logo from '@repo/ui/components/brand/logo'
import type { User } from '@supabase/supabase-js'

export default function MobileNavbar({
  user,
  profile,
  collections,
  collection,
  className,
  blocking,
}: {
  user: User
  profile: Profile
  collections: Collection[]
  collection?: Collection
  className?: string
  blocking?: boolean
}) {
  return (
    <>
      <nav
        className={cn(
          'fixed z-50 flex h-13 w-full flex-row items-center justify-between overflow-hidden border-border border-b bg-background px-3 md:hidden',
          className,
        )}
      >
        <div className="flex w-fit items-center justify-start 2sx:gap-0.5 xs:gap-1.5">
          <Link
            href="/studio"
            className={cn('shrink-0', !collection && '2xs:flex hidden')}
          >
            <Logo className="size-8 shrink-0" />
          </Link>
          {collection && (
            <>
              <PiChevronRightStroke className="my-auto h-4 w-4" />
              <CollectionPicker
                collections={collections}
                currentCollection={collection}
                className="w-fit"
              />
              <PiChevronRightStroke className="my-auto h-4 w-4" />
              <MobileNavbarLinks currentCollection={collection.slug} />
            </>
          )}
        </div>
        <UserButton type="navbar" user={user} profile={profile} />
      </nav>
      {blocking && <div className="h-13 w-screen md:hidden" />}
    </>
  )
}
