'use client'

import { AddressesInput } from '@/app/(start)/_components/addresses-input'
import type React from 'react'
import Logo from '@repo/ui/blocks/brand/logo'
import { ThemeToggle } from '@/components/theme-toggle'
import { toast } from '@repo/ui/components/sonner'
import { importWallets } from '@/app/(start)/_server/import-wallets'
import type { AddressInfo } from '@/app/(start)/_server/resolve-address'
import { useEffect, useState } from 'react'
import type { Sync } from '@/db/schemas/syncs'
import { useRouter } from 'next/navigation'
import type { Wallet } from '@/db/schemas/wallets'

export function Start() {
  const [syncing, setSyncing] = useState(false)
  const [wallets, setWallets] = useState<Wallet[]>([])

  async function onSubmit(addresses: AddressInfo[]) {
    /* const { data, error } = await signIn.anonymous()
    if (error) {
      toast.error(error?.message || 'Failed to sign you in anonymously')
      return
    } */
    const { result: wallets, error: importWalletsError } =
      await importWallets(addresses)

    if (importWalletsError) {
      toast.error(
        importWalletsError?.message || 'Failed to import your wallets',
      )
      return
    }
    setWallets(wallets)

    // TODO: Start sync
  }

  return (
    <div className="relative grid h-screen place-items-center">
      <Logo name className="absolute top-4 left-4 h-6 w-auto" />
      <ThemeToggle className="absolute top-4 right-4 " />
      {syncing ? (
        <Syncing wallets={wallets} />
      ) : (
        <div className="flex w-full max-w-xl flex-col items-center gap-8">
          <h1 className="font-bold text-3xl">Meet your internet inventory</h1>
          <AddressesInput onSubmit={onSubmit} />
        </div>
      )}
    </div>
  )
}

export function Syncing({
  wallets,
}: {
  wallets: Wallet[]
}) {
  const router = useRouter()

  return (
    <div className="flex w-full max-w-lg flex-col gap-10">
      <div className="flex flex-col gap-2">
        <h1 className="font-bold text-3xl">Give us a moment</h1>
        <p className="max-w-[26rem] text-muted-foreground text-sm">
          We&apos;re importing your collection. This may take a bit depending on
          the number of NFTs you have.
        </p>
      </div>
    </div>
  )
}
