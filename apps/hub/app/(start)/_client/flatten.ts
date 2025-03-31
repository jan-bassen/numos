'use client'

import type { AddressInfo } from '@/app/(start)/_server/resolve-address'

export function flattenAddressInfos(addresses: AddressInfo[]): AddressInfo[] {
  return addresses.reduce<AddressInfo[]>((acc, addr) => {
    acc.push(addr)
    if (addr.delegations) {
      acc.push(...flattenAddressInfos(addr.delegations))
    }
    return acc
  }, [])
}
