'use client'

import type { AddressInfo } from '@/app/_server/resolve-address'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@repo/ui/components/card'
import { cn } from '@repo/ui/lib/utils'
import { Switch } from '@repo/ui/components/switch'
import { addressTypeInfo } from '@repo/shared/constants/addresses'

export function AddressItem({
  addressInfo,
  className,
  disable,
}: {
  addressInfo: AddressInfo
  className?: string
  disable?: (enabled: boolean) => void
}) {
  const hasHumanReadable =
    addressInfo.humanReadable && addressInfo.humanReadable !== ''
  const description = hasHumanReadable ? addressInfo.address : null
  return (
    <div className="flex w-full justify-between px-4">
      {hasHumanReadable ? (
        <div className="flex items-baseline gap-2">
          <h1 className="font-medium">{addressInfo.humanReadable}</h1>
          <p className="text-muted-foreground text-xs">
            {addressInfo.address.slice(0, 7)}...
            {addressInfo.address.slice(-5)}
          </p>
        </div>
      ) : (
        <h1 className="flex items-center gap-2 pt-0.5 text-sm">
          {addressTypeInfo[addressInfo.type].icons.stroke({
            className: 'size-5 stroke-0 ',
          })}
          {addressInfo.address}
        </h1>
      )}
      <Switch
        checked={!addressInfo.disabled}
        onCheckedChange={(v) => {
          disable?.(v)
        }}
      />
    </div>
  )
}
