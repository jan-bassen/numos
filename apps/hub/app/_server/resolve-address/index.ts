'use server'

import type { SerializedResponse } from '@repo/shared/result/try'
import { Err } from '@repo/shared/result/err'
import { Ok } from '@repo/shared/result/ok'
import { snsLookup, snsReverseLookup } from '../sns'
import { parseAddress } from '@/app/_server/resolve-address/parse'
import { resolveEvmAddress } from './evm'
import { resolveEnsAddress } from './ens'

type BaseAddressType = 'evm' | 'sol'

export type AddressInfo = {
  id: string
  address: string
  humanReadable?: string | null
  type: BaseAddressType
  delegations?: AddressInfo[]
  disabled?: boolean
}

export async function getAddressInfo(address: {
  id: string
  address: string
}): Promise<SerializedResponse<AddressInfo>> {
  const res = await parseAddress(address)
  if (!res.ok) {
    return res.toSerializedResponse()
  }
  switch (res.value.type) {
    case 'evm': {
      const addressInfo = await resolveEvmAddress(res.value)
      return addressInfo.toSerializedResponse()
    }
    case 'ens': {
      const addressInfo = await resolveEnsAddress(res.value)
      return addressInfo.toSerializedResponse()
    }
    case 'sol': {
      const humanReadable = await snsReverseLookup(res.value.address)
      return new Ok({
        id: res.value.id,
        type: res.value.type,
        address: res.value.address,
        humanReadable,
      }).toSerializedResponse()
    }
    case 'sns': {
      const address = await snsLookup(res.value.address)
      if (!address) {
        return new Err('SNS name not found', 'validation', {
          issues: [{ path: [], message: 'SNS name not found', code: 'custom' }],
        }).toSerializedResponse()
      }
      return new Ok({
        id: res.value.id,
        type: 'sol' as const,
        address,
        humanReadable: res.value.address,
      }).toSerializedResponse()
    }
    case 'sei':
    case 'flow': {
      return new Err('Unsupported address type', 'validation', {
        issues: [
          { path: [], message: 'Unsupported address type', code: 'custom' },
        ],
      }).toSerializedResponse()
    }

    default:
      return new Err('Invalid address', 'validation', {
        issues: [{ path: [], message: 'Invalid address', code: 'custom' }],
      }).toSerializedResponse()
  }
}
