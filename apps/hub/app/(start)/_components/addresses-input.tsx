'use client'

import * as React from 'react'
import { Badge } from '@repo/ui/components/badge'
import { Button } from '@repo/ui/components/button'
import { Input } from '@repo/ui/components/input'
import { PiCrossCross } from '@repo/ui/icons/pika'
import { Grid } from '@repo/ui/blocks/backgrounds/grid'
import { useAddressInput } from '@/app/(start)/_client/use-address-input'
import { AddressItem } from './address-item'
import { AddressDelegations } from './address-delegations'
import { flattenAddressInfos } from '@/app/(start)/_client/flatten'
import type { AddressInfo } from '@/app/(start)/_server/resolve-address'

interface AddressesInputProps {
  placeholder?: string
  disabled?: boolean
  maxValues?: number
  onSubmit: (addresses: AddressInfo[]) => void
}

export function AddressesInput({
  placeholder = 'Add your public addresses',
  disabled = false,
  maxValues = 100,
  onSubmit,
}: AddressesInputProps) {
  const {
    inputs,
    addresses,
    addressErrors,
    getToggleAddress,
    disabledAddresses,
    containerRef,
    handleContainerClick,
    inputRef,
    inputValue,
    handleKeyDown,
    removeValue,
    setInputValue,
  } = useAddressInput()

  return (
    <>
      <div
        ref={containerRef}
        className="relative flex h-fit min-h-28 w-full min-w-96 cursor-text flex-wrap items-start gap-x-2 gap-y-1 overflow-hidden rounded-3xl border-2 border-border p-3 shadow-inner focus-within:ring-4 focus-within:ring-ring focus-within:ring-offset-2"
        onClick={handleContainerClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleContainerClick()
          }
        }}
        role="button"
        tabIndex={0}
      >
        <div className="absolute inset-0 " />
        {inputs.map((input) => (
          <Badge
            key={input.id}
            variant={addressErrors[input.id] ? 'destructive' : 'outline'}
            className="!h-8 z-10 cursor-default select-none rounded-full bg-background pl-4 font-medium text-base shadow"
          >
            {input.shortAddress}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="ml-1 h-4 w-4 p-0 hover:bg-muted"
              onClick={(e) => {
                e.stopPropagation()
                removeValue(input)
              }}
              disabled={disabled}
              aria-label={`Remove ${input.address}`}
            >
              <PiCrossCross className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
        <Input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={inputs.length === 0 ? placeholder : ''}
          className="!font-medium !text-base !h-8 min-w-[120px] flex-1 rounded-none border-0 p-0 shadow-none placeholder:font-medium placeholder:text-base focus-visible:ring-0 focus-visible:ring-offset-0"
          disabled={disabled || inputs.length >= maxValues}
        />
        <Grid />
      </div>
      {addresses.length > 0 && (
        <div className="flex w-full max-w-2xl flex-col gap-1.5">
          {addresses.map((addressInfo) => {
            return (
              <div key={addressInfo.id} className="flex flex-col px-4">
                <AddressItem
                  addressInfo={addressInfo}
                  disable={getToggleAddress(addressInfo.id)}
                  disabled={disabledAddresses.includes(addressInfo.id)}
                />
                {addressInfo.delegations &&
                  addressInfo.delegations.length > 0 && (
                    <AddressDelegations
                      delegations={addressInfo.delegations}
                      disabledAddresses={disabledAddresses}
                      getToggleAddress={getToggleAddress}
                    />
                  )}
              </div>
            )
          })}
        </div>
      )}
      <Button
        className="px-6"
        disabled={addresses.length === 0}
        onClick={() => {
          const flattenedAddresses = flattenAddressInfos(addresses)
          const enabledAddresses = flattenedAddresses.filter(
            (address) => !disabledAddresses.includes(address.id),
          )
          onSubmit(enabledAddresses)
        }}
      >
        Get started!
      </Button>
    </>
  )
}
