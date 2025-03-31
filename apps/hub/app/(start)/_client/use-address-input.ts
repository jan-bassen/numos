import { useRef, useState, useTransition } from 'react'
import {
  type AddressInfo,
  getAddressInfo,
} from '@/app/(start)/_server/resolve-address'
import { parseAddress, type ParsedAddress } from '@/app/(start)/_client/parse'

export function useAddressInput() {
  const [inputValue, setInputValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [inputs, setInputs] = useState<ParsedAddress[]>([])
  const [addresses, setAddresses] = useState<AddressInfo[]>([])
  const [addressErrors, setAddressErrors] = useState<Record<string, string>>({})
  const [disabledAddresses, setDisabledAddresses] = useState<string[]>([])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      addValue(inputValue)
    } else if (e.key === 'Backspace' && !inputValue && inputs.length > 0) {
      const lastValue = inputs[inputs.length - 1]
      if (lastValue) {
        removeValue(lastValue)
      }
    }
  }

  const handleContainerClick = () => {
    inputRef.current?.focus()
  }

  const addValue = (value: string) => {
    const trimmedValue = value.trim()
    if (trimmedValue && !inputs.some((v) => v.address === trimmedValue)) {
      const id = crypto.randomUUID()
      const parsedAddress = parseAddress({
        id,
        address: trimmedValue,
      })
      if (!parsedAddress.ok) {
        setAddressErrors((prev) => ({
          ...prev,
          [id]: parsedAddress.message,
        }))
      } else {
        onChange([...inputs, parsedAddress.value])
        setInputValue('')
        onNewInput?.(parsedAddress.value)
      }
    }
  }

  const removeValue = (valueToRemove: ParsedAddress) => {
    onChange(inputs.filter((value) => value.id !== valueToRemove.id))
    onRemoveInput?.(valueToRemove)
  }

  async function onNewInput(input: ParsedAddress) {
    const parsedAddress = parseAddress(input)

    if (!parsedAddress.ok) {
      setAddressErrors((prev) => ({
        ...prev,
        [input.id]: parsedAddress.message,
      }))
    } else {
      const { result, error } = await getAddressInfo(parsedAddress.value)
      if (error) {
        setAddressErrors((prev) => ({
          ...prev,
          [input.id]: error.message,
        }))
      } else {
        // TODO: Check if the address is already in the delegations
        if (
          addresses.some((a) => a.id === input.id) ||
          addresses.some((a) => a.address === result.address)
        ) {
          setAddressErrors((prev) => ({
            ...prev,
            [input.id]: 'Address already exists',
          }))
        } else {
          setAddresses((prev) => [...prev, result])
        }
      }
    }
  }

  function onChange(addresses: ParsedAddress[]) {
    setInputs(addresses)
  }

  function onRemoveInput(input: ParsedAddress) {
    setAddresses((prev) => prev.filter((a) => a.id !== input.id))
  }

  function getToggleAddress(id: string) {
    return (enabled: boolean) => {
      setDisabledAddresses((prev) => {
        return enabled ? [...prev, id] : prev.filter((a) => a !== id)
      })
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
    onNewInput,
    getToggleAddress,
    disabledAddresses,
    containerRef,
    handleContainerClick,
    inputRef,
    inputValue,
    handleKeyDown,
    removeValue,
    setInputValue,
  }
}
