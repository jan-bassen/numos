import { Err } from '@repo/shared/result/err'
import 'server-only'
import type { Result } from '@repo/shared/result/try'
import type { AddressInfo } from '.'
import type { ParsedEnsAddress } from '@/app/(start)/_client/parse'
import { eth } from '@/server/viem'
import { normalize } from 'viem/ens'
import { Ok } from '@repo/shared/result/ok'
import { resolveIncomingDelegations } from './evm'

export async function resolveEnsAddress({
  id,
  address: ensAddress,
  shortAddress,
}: ParsedEnsAddress): Promise<Result<AddressInfo>> {
  const address = await eth.getEnsAddress({
    name: normalize(ensAddress),
  })
  if (!address) {
    return new Err('ENS name not found', 'validation', {
      issues: [{ path: [], message: 'ENS name not found', code: 'custom' }],
    })
  }
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
    address,
    shortAddress,
    humanReadable: ensAddress,
    delegations: delegations.value,
  })
}
