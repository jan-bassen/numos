'use client'

import { Button, buttonVariants } from '@repo/ui/components/ui/button'
import { cn } from '@repo/ui/lib/utils'
import Link from 'next/link'
import CollectionPicker from './collection-picker'
import type { Collection, Profile } from '@/types/database.types'
import UserButton from '../user/user-button'
import { NavbarLinks, iconClassesStroke } from './navbar-links'
import { PiChatChattingStroke } from '@repo/ui/icons/pika'
import { NavbarCollectionLinks } from './navbar-links-collections'
import Logo from '@repo/ui/components/brand/logo'
import { H2 } from '../layout/pages/headings'
import { Badge } from '@repo/ui/components/ui/badge'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import { useMediaQuery } from '@/lib/hooks/media-query'
import { X } from 'lucide-react'

export default function Navbar({
  collections,
  user,
  profile,
  collection,
  className,
}: {
  collections: Collection[]
  user: User
  profile: Profile
  collection?: Collection
  className?: string
}) {
  const [collapsed, setCollapsed] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const isXLScreen = useMediaQuery('(min-width: 1280px)')
  const pathname = usePathname()
  const segments = pathname.split('/')

  useEffect(() => {
    /* if (isXLScreen) {
      setCollapsed(false);
    } else */ if (
      segments.length > 3 &&
      (segments[3] === 'actions' || segments[3] === 'attributes')
    ) {
      setCollapsed(true)
    } else {
      setCollapsed(false)
    }
  }, [segments])
  return (
    <>
      <div
        className={cn(
          'z-40 hidden h-[100svh] w-56 shrink-0 overflow-x-hidden overflow-y-scroll md:block',
          collapsed ? 'md:w-13' : 'md:w-56',
        )}
      />
      <nav
        className={cn(
          'fixed z-40 hidden h-[100svh] w-56 shrink-0 flex-col justify-between border-border border-r bg-background md:flex',
          collapsed ? 'md:w-13' : 'md:w-56',
          className,
        )}
      >
        <div className="size-full grow-0 flex-col justify-between overflow-x-hidden md:flex">
          <div
            className={cn(
              'flex w-full grow-0 flex-col gap-4',
              collapsed ? 'px-1.5 py-3' : 'p-3',
            )}
          >
            <Link
              href="/collections"
              className={cn(
                buttonVariants({ variant: 'ghost' }),
                'h-auto items-center',
                collapsed
                  ? 'justify-center p-1'
                  : 'justify-start gap-2 py-3 pr-2 pl-3',
              )}
            >
              <Logo className={cn(collapsed ? 'size-7' : 'size-4')} />
              <H2 className={cn('font-bold text-2xl', collapsed && 'hidden')}>
                Studio
              </H2>
              <Badge
                variant={'secondary'}
                className={cn(
                  'mt-0.5 ml-1 h-5 px-1.5 py-0.5 text-2xs',
                  collapsed && 'hidden',
                )}
              >
                beta
              </Badge>
            </Link>
            {collection ? (
              <>
                <CollectionPicker
                  collapsed={collapsed}
                  currentCollection={collection}
                  collections={collections}
                />
                <NavbarLinks
                  currentCollection={collection?.slug}
                  collapsed={collapsed}
                />
              </>
            ) : (
              <NavbarCollectionLinks collections={collections} />
            )}
          </div>
          <div className={cn('flex flex-col gap-3')}>
            <div
              className={cn('flex flex-col gap-1 px-3', collapsed && 'px-1.5')}
            >
              <Button
                variant={'ghost'}
                className={cn(
                  'custom-chat-button flex gap-3 align-middle text-base text-foreground md:text-muted-foreground md:text-sm',
                  collapsed ? 'justify-center p-2' : 'justify-start ',
                )}
                onClick={() => {
                  setChatOpen(!chatOpen)
                }}
              >
                <PiChatChattingStroke className={iconClassesStroke} />
                {!collapsed && 'Support Chat'}
              </Button>
            </div>
            <UserButton
              type="navbar"
              collapsed={collapsed}
              user={user}
              profile={profile}
              onOpen={() => setChatOpen(false)}
            />
          </div>
        </div>
      </nav>
      <div
        id="custom-chat-widget"
        className={cn(
          'absolute bottom-[3.75rem] z-[1000] overflow-hidden rounded-lg border border-border shadow-lg',
          chatOpen ? 'block' : 'hidden',
          collapsed ? 'left-[3.75rem]' : 'left-[14.5rem]',
        )}
      >
        <Button
          variant={'none'}
          size={'iconMedium'}
          className="absolute top-2 right-2 z-[1010] text-white hover:bg-white/10"
          onClick={() => {
            setChatOpen(false)
          }}
        >
          <X />
        </Button>
      </div>
    </>
  )
}
