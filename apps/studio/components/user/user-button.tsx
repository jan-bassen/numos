'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@repo/ui/components/ui/dropdown-menu'
import Link from 'next/link'
import { Button } from '@repo/ui/components/ui/button'
import { ThemeTabSelect } from '../nav/theme-tab-select'
import {
  PiHomeAltStroke,
  PiLogOutRightStroke,
  PiSparkleAi02Stroke,
  PiUserUser02Stroke,
} from '@repo/ui/icons/pika'
import { createSupabaseClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import { usePathname, useRouter } from 'next/navigation'
import type { Profile } from '@/types/database.types'
import { cn } from '@repo/ui/lib/utils'
import { Avatar } from './avatar'

export default function UserButton({
  type,
  collapsed,
  user,
  profile,
  onOpen,
  onClose,
}: {
  type: 'navbar' | 'header'
  collapsed?: boolean
  user: User
  profile: Profile
  onOpen?: () => void
  onClose?: () => void
}) {
  const router = useRouter()
  const pathname = usePathname()
  const isStudio = pathname.startsWith('/studio')

  const signOut = async () => {
    const supabase = await createSupabaseClient()
    const { error } = await supabase.auth.signOut()
    if (error) {
      throw new Error('Error signing out')
    }
    router.push('/login')
  }

  return (
    <DropdownMenu onOpenChange={(open) => (open ? onOpen?.() : onClose?.())}>
      <DropdownMenuTrigger asChild>
        {type === 'navbar' ? (
          <Button
            variant="ghost"
            className={cn(
              'flex h-full rounded-full p-0 md:h-14 md:w-full md:rounded-none ',
              collapsed
                ? 'justify-center p-1'
                : 'md:justify-start md:gap-2 md:border-t md:px-4 md:py-2',
            )}
          >
            <Avatar
              internal={!!profile?.avatar_url}
              src={profile?.avatar_url || user?.user_metadata.avatar_url || ''}
              size={32}
              className="shrink-0 rounded-full object-contain"
            />
            <p
              className={cn(
                'line-clamp-2 hidden self-center text-ellipsis text-left text-base md:text-sm',
                !collapsed && 'md:inline',
              )}
            >
              {profile?.full_name ||
                profile?.username ||
                user?.user_metadata.name ||
                'User'}
            </p>
          </Button>
        ) : type === 'header' ? (
          <Button variant="ghost" className="flex h-fit rounded-full p-0">
            <Avatar
              internal={!!profile?.avatar_url}
              src={profile?.avatar_url || user?.user_metadata.avatar_url || ''}
              size={36}
              className="shrink-0 rounded-full object-contain md:size-9"
            />
          </Button>
        ) : null}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        sideOffset={8}
        align={type === 'header' ? 'end' : undefined}
        alignOffset={type === 'header' ? -10 : undefined}
        className="ml-2 mr-0.5 mt-1 min-w-[10rem] md:mr-2 md:mt-0 md:w-48"
      >
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            {isStudio ? (
              <Link href="https://numos.xyz" className="flex h-9 gap-1.5">
                <PiHomeAltStroke className="my-auto h-4 w-4" />
                Homepage
              </Link>
            ) : (
              <Link href="/collections" className="flex h-9 gap-1.5">
                <PiSparkleAi02Stroke className="my-auto h-4 w-4" />
                Studio
              </Link>
            )}
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/user" className="flex h-9 gap-1.5">
              <PiUserUser02Stroke className="my-auto h-4 w-4" />
              Account
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => signOut()}
            className="flex h-9 gap-1.5"
          >
            <PiLogOutRightStroke className="my-auto h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <ThemeTabSelect />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
