import { http } from 'viem'
import { DelegateV2 } from '@delegatexyz/sdk'

const RPC_URL = process.env.ALCHEMY_RPC_URL
export const delegate = new DelegateV2({
  userTransport: http(RPC_URL),
})
