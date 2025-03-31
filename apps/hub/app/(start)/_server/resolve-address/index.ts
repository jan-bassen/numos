'use server'

import type { SerializedResponse } from '@repo/shared/result/try'
import { Err } from '@repo/shared/result/err'
import type { ParsedAddress } from '@/app/(start)/_client/parse'
import { resolveEvmAddress } from './evm'
import { resolveEnsAddress } from './ens'

type BaseAddressType = 'evm' | 'sol'

export type AddressInfo = {
  id: string
  address: string
  shortAddress: string
  humanReadable?: string | null
  type: BaseAddressType
  delegations?: AddressInfo[]
}

export async function getAddressInfo(
  parsedAddress: ParsedAddress,
): Promise<SerializedResponse<AddressInfo>> {
  switch (parsedAddress.type) {
    case 'evm': {
      const addressInfo = await resolveEvmAddress(parsedAddress)
      return addressInfo.toSerializedResponse()
    }
    case 'ens': {
      const addressInfo = await resolveEnsAddress(parsedAddress)
      return addressInfo.toSerializedResponse()
    }
    case 'sol': {
      return new Err(
        "We don't support Solana yet, but we've noticed your demand!",
        'validation',
        {
          issues: [
            { path: [], message: 'SNS lookup not supported', code: 'custom' },
          ],
        },
      ).toSerializedResponse()
      /* const humanReadable = await snsReverseLookup(parsedAddress.address)
      return new Ok({
        id: parsedAddress.id,
        type: 'sol' as const,
        address: parsedAddress.address,
        humanReadable,
      }).toSerializedResponse() */
    }
    case 'sns': {
      return new Err(
        "We don't support Solana yet, but we've noticed your demand!",
        'validation',
        {
          issues: [
            { path: [], message: 'SNS lookup not supported', code: 'custom' },
          ],
        },
      ).toSerializedResponse()
      /* const address = await snsLookup(parsedAddress.address)
      if (!address) {
        return new Err('SNS name not found', 'validation', {
          issues: [{ path: [], message: 'SNS name not found', code: 'custom' }],
        }).toSerializedResponse()
      }
      return new Ok({
        id: parsedAddress.id,
        type: 'sol' as const,
        address: parsedAddress.address,
        humanReadable: parsedAddress.address,
      }).toSerializedResponse() */
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
