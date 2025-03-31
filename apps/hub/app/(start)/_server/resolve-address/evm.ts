'use server'

import 'server-only'
import { eth } from '@/server/viem'
import { Err } from '@repo/shared/result/err'
import { delegate } from '@/server/delegations/delegate'
import type { ParsedEvmAddress } from '@/app/(start)/_client/parse'
import type { AddressInfo } from '.'
import type { Result } from '@repo/shared/result/try'
import { Ok } from '@repo/shared/result/ok'
import { getShortEvmAddress } from '@/utils/addresses'

export async function resolveIncomingDelegations(
  address: `0x${string}`,
): Promise<Result<AddressInfo[]>> {
  const delegations = await delegate.getIncomingDelegations(address)
  const delegationsInfo = await Promise.all(
    delegations.map(async (delegation) => {
      const addressInfo = await resolveEvmAddress({
        id: crypto.randomUUID(),
        address: delegation.from,
        type: 'evm' as const,
        shortAddress: getShortEvmAddress(delegation.from),
      })
      if (!addressInfo.ok) {
        return new Err('Failed to resolve delegation', 'validation', {
          issues: [
            {
              path: [],
              message: 'Failed to resolve delegation',
              code: 'custom',
            },
          ],
        })
      }
      return addressInfo
    }),
  )
  return new Ok(delegationsInfo.filter((d) => d.ok).map((d) => d.value))
}

export async function resolveEvmAddress({
  id,
  address,
  shortAddress,
}: ParsedEvmAddress): Promise<Result<AddressInfo>> {
  const humanReadable = await eth.getEnsName({
    address: address,
  })
  const delegations = await resolveIncomingDelegations(address)
  if (!delegations.ok) {
    return new Err('Failed to resolve delegations', 'validation', {
      issues: [
        { path: [], message: 'Failed to resolve delegations', code: 'custom' },
      ],
    })
  }
  return new Ok({
    id,
    type: 'evm' as const,
    address: address,
    shortAddress: shortAddress,
    humanReadable: humanReadable || undefined,
    delegations: delegations.value,
  })
}
