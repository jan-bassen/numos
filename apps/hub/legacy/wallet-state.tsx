import { Badge } from '@repo/ui/components/badge'
import Image from 'next/image'
import { PiSpinnerStroke } from '@repo/ui/icons/pika'
import { chainInfo, supportedChains } from '@repo/shared/constants/chains'
import type { Wallet } from '@/db/schemas/wallets'
import type { SyncState } from '@/db/schemas/syncs'

export function WalletState({
  wallets,
  state,
}: {
  wallets: Wallet[]
  state?: SyncState | null
}) {
  if (!state) {
    return null
  }
  return (
    <ul className="flex w-full flex-col gap-6">
      {wallets.map((wallet) => (
        <li key={wallet.id} className="flex w-full flex-col gap-2">
          <h2 className="font-bold text-lg">
            {wallet.humanReadable || wallet.shortAddress}
          </h2>
          <ul className="flex w-full items-start gap-3">
            {supportedChains.map((chain) => {
              const status = state[wallet.id]?.[chain]?.status
              return (
                <Badge
                  key={chain}
                  variant={
                    status === 'success'
                      ? 'default'
                      : status === 'syncing'
                        ? 'outline'
                        : status === 'failed'
                          ? 'destructive'
                          : 'muted'
                  }
                  className="flex items-center gap-1.5 font-medium text-sm transition-all duration-300"
                >
                  {status === 'success' || status === 'failed' ? (
                    <Image
                      src={`/logos/${chain}_white.svg`}
                      className=" size-3"
                      alt={chain}
                      width={20}
                      height={20}
                      unoptimized
                    />
                  ) : (
                    <>
                      <Image
                        src={`/logos/${chain}.svg`}
                        className="size-3 dark:hidden"
                        alt={chain}
                        width={20}
                        height={20}
                        unoptimized
                      />
                      <Image
                        src={`/logos/${chain}_white.svg`}
                        className="hidden size-3 dark:block"
                        alt={chain}
                        width={20}
                        height={20}
                        unoptimized
                      />
                    </>
                  )}
                  {chainInfo[chain].name}
                  {status === 'syncing' && (
                    <PiSpinnerStroke className="size-3 animate-spin" />
                  )}
                </Badge>
              )
            })}
          </ul>
        </li>
      ))}
    </ul>
  )
}
