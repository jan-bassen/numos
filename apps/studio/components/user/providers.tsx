import { Button } from '@repo/ui/components/ui/button'
import { Separator } from '@repo/ui/components/ui/separator'
import {
  PiCrossCross,
  PiEnvelopeDefaultStroke,
  PiGithubStroke,
  PiXComStroke,
} from '@/lib/icons'
import { createSupabaseClient } from '@/lib/supabase/client'
import type { Provider, UserIdentity } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import type { SVGProps } from 'react'
import { toast } from 'sonner'

const providers: {
  [key: string]: {
    name: string
    icon: (props: SVGProps<SVGSVGElement>) => JSX.Element
  }
} = {
  email: {
    name: 'Email',
    icon: PiEnvelopeDefaultStroke,
  },
  twitter: {
    name: 'Twitter',
    icon: PiXComStroke,
  },
  github: {
    name: 'GitHub',
    icon: PiGithubStroke,
  },
}

function getName(identity: UserIdentity) {
  switch (identity.provider) {
    case 'twitter':
      return `@${identity.identity_data?.user_name}`
    case 'email':
      return identity.identity_data?.email
    case 'github':
      return identity.identity_data?.user_name
    default:
      return ''
  }
}

export default function Identities({
  identities,
  setPasswordDialogOpen,
}: {
  identities: UserIdentity[]
  setPasswordDialogOpen: (value: boolean) => void
}) {
  const router = useRouter()

  const unlinkedIdentities = Object.keys(providers).filter(
    (provider) =>
      provider !== 'email' &&
      !identities.find((identity) => identity.provider === provider),
  )
  const unlinkIdentity = async (identity: UserIdentity) => {
    if (identity.provider === 'email') {
      toast.error('Emails cannot be unlinked')
      return
    }
    const supabase = await createSupabaseClient()
    const { error } = await supabase.auth.unlinkIdentity(identity)
    if (error) {
      toast.error('Error unlinking identity')
    } else {
      router.refresh()
    }
  }

  const linkIdentity = async (provider: Provider) => {
    const supabase = await createSupabaseClient()
    const { data, error } = await supabase.auth.linkIdentity({
      provider,
      options: {
        redirectTo: `${location.origin}/user/`,
      },
    })
    if (error) {
      toast.error('Error linking identity')
      return
    }
  }
  return (
    <ul className="flex flex-col gap-6 pt-2">
      {identities.map((identity) => (
        <li
          key={identity.provider}
          className="flex items-center justify-between gap-2"
        >
          <div className="flex -sm:w-full -sm:items-start items-center gap-4">
            <div className="flex items-center gap-2">
              {providers[identity.provider]?.icon({ className: 'size-4' })}
              {providers[identity.provider]?.name}
            </div>
            <p className="h-fit rounded-sm bg-muted px-2 py-1 font-normal text-muted-foreground text-xs">
              {getName(identity)}
            </p>
          </div>
          {identity.provider === 'email' && (
            <Button
              type="button"
              variant={'secondary'}
              className="-sm:hidden h-fit rounded-sm bg-muted px-2 py-1 font-normal text-xs"
              onClick={() => setPasswordDialogOpen(true)}
            >
              Change Password
            </Button>
          )}
          {identities?.length > 1 && identity.provider !== 'email' && (
            <Button
              type="button"
              variant="ghost"
              size="iconSmall"
              onClick={() => unlinkIdentity(identity)}
            >
              <PiCrossCross className="size-3.5" />
            </Button>
          )}
        </li>
      ))}
      {unlinkedIdentities.length > 0 && <Separator key={'seperator'} />}
      {unlinkedIdentities.map((provider) => (
        <li key={provider} className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            {providers[provider]?.icon({
              className: 'size-4',
            })}
            {providers[provider]?.name}
          </div>
          <Button
            variant={'secondary'}
            className="h-fit rounded-sm bg-muted px-2 py-1 font-normal text-xs"
            onClick={() => linkIdentity(provider as Provider)}
          >
            Connect
          </Button>
        </li>
      ))}
    </ul>
  )
}
