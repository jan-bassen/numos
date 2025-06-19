'use client'

import { useState } from 'react'
import { getWalletClient, getBlockchainClient } from './client'
import { formatEther } from 'viem'
import { Button } from '@repo/ui/components/button'
import { PiWalletLinkStroke } from '@repo/ui/icons/pika'

export default function WalletButton() {
  const [address, setAddress] = useState<string | null>(null)
  const [balance, setBalance] = useState<string | null>(null)

  async function handleClick() {
    try {
      const walletClient = await getWalletClient()
      const publicClient = getBlockchainClient('mainnet')
      const [address] = await walletClient.requestAddresses()
      if (!address) throw new Error('No address')
      const balance = formatEther(await publicClient.getBalance({ address }))
      setAddress(address)
      setBalance(balance)
    } catch (error) {
      alert(`Transaction failed: ${error}`)
    }
  }

  return (
    <>
      <Status address={address} balance={balance} />
      <Button onClick={handleClick} className="gap-2 w-fit">
        <PiWalletLinkStroke className="size-4" />
        Connect Wallet
      </Button>
    </>
  )
}

function Status({
  address,
  balance,
}: {
  address: string | null
  balance: string | null
}) {
  if (!address) {
    return (
      <div className="flex items-center">
        <div className="border bg-red-600 border-red-600 rounded-full w-1.5 h-1.5 mr-2" />
        <div>Disconnected</div>
      </div>
    )
  }
  return (
    <div className="flex items-center w-full">
      <div className="border bg-green-500 border-green-500 rounded-full w-1.5 h-1.5 mr-2" />
      <div className="text-xs md:text-xs">
        {address} <br /> Balance: {balance}
      </div>
    </div>
  )
}
