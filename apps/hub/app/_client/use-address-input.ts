import { useState } from 'react'
import { type AddressInfo, getAddressInfo } from '@/app/_server/resolve-address'

export function useAddressInput() {
  const [inputs, setInputs] = useState<{ id: string; input: string }[]>([])
  const [addresses, setAddresses] = useState<AddressInfo[]>([])
  const [addressErrors, setAddressErrors] = useState<Record<string, string>>({})

  async function handleNewInput({ id, input }: { id: string; input: string }) {
    const { result, error } = await getAddressInfo({
      id,
      address: input,
    })
    if (error) {
      setAddressErrors((prev) => ({
        ...prev,
        [id]: error.message,
      }))
    } else {
      if (
        addresses.some((a) => a.id === id) ||
        addresses.some((a) => a.address === result.address)
      ) {
        setAddressErrors((prev) => ({
          ...prev,
          [id]: 'Address already exists',
        }))
      } else {
        setAddresses((prev) => [...prev, result])
      }
    }
  }

  function onChange(addresses: { id: string; input: string }[]) {
    setInputs(addresses)
  }

  function onRemoveInput({ id, input }: { id: string; input: string }) {
    setAddresses((prev) => prev.filter((a) => a.id !== id))
  }

  function getToggleAddress(id: string) {
    return (enabled: boolean) => {
      setAddresses((prev) =>
        prev.map((a) => {
          if (a.id === id) {
            return { ...a, disabled: !enabled }
          }
          return a
        }),
      )
    }
  }

  return {
    inputs,
    addresses,
    addressErrors,
    onChange,
    onRemoveInput,
    setAddresses,
    setAddressErrors,
    handleNewInput,
    getToggleAddress,
  }
}
