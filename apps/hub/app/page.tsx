'use client'

import { AddressesInput } from '@/app/_components/addresses-input'
import type React from 'react'
import { AddressItem } from '@/app/_components/address-item'
import { useAddressInput } from '@/app/_client/use-address-input'
import Logo from '@repo/ui/blocks/brand/logo'
import { Button } from '@repo/ui/components/button'
import { ThemeToggle } from '@/app/_client/theme-toggle'
export default function Home() {
  const {
    inputs,
    addresses,
    addressErrors,
    handleNewInput,
    onChange,
    onRemoveInput,
    getToggleAddress,
  } = useAddressInput()

  return (
    <div className="relative grid h-screen place-items-center">
      <Logo name className="absolute top-4 left-4 h-6 w-auto" />
      <ThemeToggle className="absolute top-4 right-4 " />
      <div className="flex w-full max-w-xl flex-col items-center gap-8">
        <h1 className="font-bold text-3xl">Meet your internet inventory</h1>
        <AddressesInput
          values={inputs}
          errors={addressErrors}
          onChange={onChange}
          onNewInput={handleNewInput}
          onRemoveInput={onRemoveInput}
        />
        {addresses.length > 0 && (
          <div className="flex w-full max-w-2xl flex-col">
            {addresses.map((addressInfo) => {
              return (
                <AddressItem
                  key={addressInfo.id}
                  addressInfo={addressInfo}
                  disable={getToggleAddress(addressInfo.id)}
                />
              )
            })}
          </div>
        )}
        <Button
          variant="outline"
          className="rounded-full px-6"
          disabled={addresses.length === 0}
        >
          Get started!
        </Button>
      </div>
    </div>
  )
}
