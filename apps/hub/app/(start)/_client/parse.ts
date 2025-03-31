import type { Result } from '@repo/shared/result/try'
import { Err } from '@repo/shared/result/err'
import { Ok } from '@repo/shared/result/ok'
import { z } from 'zod'
import { PublicKey } from '@solana/web3.js'
import { isAddress } from 'viem'
import { getShortEvmAddress, getShortSolAddress } from '@/utils/addresses'

export type ParsedEvmAddress = {
  id: string
  type: 'evm'
  address: `0x${string}`
  shortAddress: `0x${string}`
}

export type ParsedSolAddress = {
  id: string
  type: 'sol'
  address: string
  shortAddress: string
}

type ParsedSeiAddress = {
  id: string
  type: 'sei'
  address: `sei1${string}`
  shortAddress: `sei1${string}`
}

type ParsedFlowAddress = {
  id: string
  type: 'flow'
  address: `0x${string}`
  shortAddress: `0x${string}`
}

export type ParsedEnsAddress = {
  id: string
  type: 'ens'
  address: `${string}.eth`
  shortAddress: `${string}.eth`
}

export type ParsedSnsAddress = {
  id: string
  type: 'sns'
  address: `${string}.sol`
  shortAddress: `${string}.sol`
}

export type ParsedAddress =
  | ParsedEvmAddress
  | ParsedSolAddress
  | ParsedSeiAddress
  | ParsedFlowAddress
  | ParsedEnsAddress
  | ParsedSnsAddress

const hexRegex = z
  .string()
  .regex(/^0x[a-fA-F0-9]{40}$/)
  .refine((address) => isAddress(address), {
    message: 'Invalid EVM address',
  })
const solanaRegex = z
  .string()
  .regex(/^[1-9A-HJ-NP-Za-km-z]{32,44}$/)
  .refine(
    (address) => {
      try {
        new PublicKey(address)
        return true
      } catch {
        return false
      }
    },
    {
      message: 'Invalid Solana address',
    },
  )
const seiRegex = z
  .string()
  .regex(/^sei1[a-z0-9]{38}$/)
  .or(hexRegex)
const flowRegex = z.string().regex(/^0x[a-fA-F0-9]{16}$/)
const ensRegex = z.string().regex(/^[^\s]+\.eth$/)
const solDomainRegex = z.string().regex(/^[^\s]+\.sol$/)

export function parseAddress(address: {
  id: string
  address: string
}): Result<ParsedAddress> {
  if (hexRegex.safeParse(address.address).success) {
    return new Ok({
      type: 'evm',
      id: address.id,
      address: address.address as `0x${string}`,
      shortAddress: getShortEvmAddress(address.address as `0x${string}`),
    })
  }
  if (solanaRegex.safeParse(address.address).success) {
    return new Ok({
      type: 'sol',
      id: address.id,
      address: address.address as string,
      shortAddress: getShortSolAddress(address.address),
    })
  }
  if (seiRegex.safeParse(address.address).success) {
    return new Err('Sei is not yet supported', 'validation', {
      issues: [{ path: [], message: 'Sei is not supported', code: 'custom' }],
    })
  }
  if (flowRegex.safeParse(address.address).success) {
    return new Err('Flow is not yet supported', 'validation', {
      issues: [{ path: [], message: 'Flow is not supported', code: 'custom' }],
    })
  }
  if (ensRegex.safeParse(address.address).success) {
    return new Ok({
      type: 'ens',
      id: address.id,
      address: address.address as `${string}.eth`,
      shortAddress: address.address as `${string}.eth`,
    })
  }
  if (solDomainRegex.safeParse(address.address).success) {
    return new Ok({
      type: 'sns',
      id: address.id,
      address: address.address as `${string}.sol`,
      shortAddress: address.address as `${string}.sol`,
    })
  }
  return new Err('Invalid address', 'validation', {
    issues: [{ path: [], message: 'Invalid address', code: 'custom' }],
  })
}
