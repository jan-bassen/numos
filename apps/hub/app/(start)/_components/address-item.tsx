'use client'

import type { AddressInfo } from '@/app/(start)/_server/resolve-address'
import { Switch } from '@repo/ui/components/switch'
import {
  PiCryptoCurrencyEthereumSolid,
  PiCryptoCurrencySolanaSolid,
  PiCryptoCurrencyEthereumStroke,
  PiCryptoCurrencySolanaStroke,
} from '@repo/ui/icons/pika'

export const addressTypeInfo = {
  evm: {
    icons: {
      solid: PiCryptoCurrencyEthereumSolid,
      stroke: PiCryptoCurrencyEthereumStroke,
    },
  },
  sol: {
    icons: {
      solid: PiCryptoCurrencySolanaSolid,
      stroke: PiCryptoCurrencySolanaStroke,
    },
  },
}

export function AddressItem({
  addressInfo,
  className,
  disable,
  disabled,
}: {
  addressInfo: AddressInfo
  className?: string
  disable?: (enabled: boolean) => void
  disabled?: boolean
}) {
  const hasHumanReadable =
    addressInfo.humanReadable && addressInfo.humanReadable !== ''
  return (
    <div className="flex w-full justify-between">
      {hasHumanReadable ? (
        <div className="flex items-baseline gap-2">
          <h1 className="font-medium">{addressInfo.humanReadable}</h1>
          <p className="text-muted-foreground text-xs">
            {addressInfo.address.slice(0, 7)}...
            {addressInfo.address.slice(-5)}
          </p>
        </div>
      ) : (
        <h1 className="flex items-center gap-2 font-medium text-[15px]">
          {addressInfo.address.slice(0, 7)}...
          {addressInfo.address.slice(-5)}
          {addressTypeInfo[addressInfo.type].icons.stroke({
            className: 'size-3.5 text-muted-foreground/80 !stroke-[1.5px]',
          })}
        </h1>
      )}
      <Switch
        checked={!disabled}
        onCheckedChange={(v) => {
          disable?.(!v)
        }}
      />
    </div>
  )
}
