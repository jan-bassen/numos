'use client'

import type { AddressInfo } from '@/app/(start)/_server/resolve-address'
import { AddressItem } from './address-item'

export function AddressDelegations({
  delegations,
  disabledAddresses,
  getToggleAddress,
}: {
  delegations: AddressInfo[]
  disabledAddresses: string[]
  getToggleAddress: (id: string) => (enabled: boolean) => void
}) {
  return (
    <ul className="flex flex-col">
      {delegations.map((delegation) => (
        <div key={delegation.address} className="group flex gap-1">
          <div className="grid min-h-full w-5 grid-rows-7 pl-1.5 group-first:pt-1">
            <div className="col-start-1 row-span-4 row-start-1 rounded-bl-md border-b-2 border-l-2" />
            <div className="col-start-1 row-span-7 row-start-1 border-l-2 group-last:hidden" />
          </div>
          <div className="w-full pt-1.5">
            <AddressItem
              addressInfo={delegation}
              disabled={disabledAddresses.includes(delegation.id)}
              disable={getToggleAddress(delegation.id)}
            />
          </div>
        </div>
      ))}
    </ul>
  )
}
