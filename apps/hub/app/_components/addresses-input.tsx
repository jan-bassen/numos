'use client'

import * as React from 'react'
import { Badge } from '@repo/ui/components/badge'
import { Button } from '@repo/ui/components/button'
import { Input } from '@repo/ui/components/input'
import { PiCrossCross } from '@repo/ui/icons/pika'

interface AddressesInputProps {
  placeholder?: string
  values: { id: string; input: string }[]
  onChange: (addresses: { id: string; input: string }[]) => void
  onNewInput?: (input: { id: string; input: string }) => void
  onRemoveInput?: (input: { id: string; input: string }) => void
  errors?: Record<string, string>
  disabled?: boolean
  maxValues?: number
}

export function AddressesInput({
  placeholder = 'Add your public addresses',
  values = [],
  onChange,
  onNewInput,
  onRemoveInput,
  errors = {},
  disabled = false,
  maxValues = 100,
}: AddressesInputProps) {
  const [inputValue, setInputValue] = React.useState('')
  const inputRef = React.useRef<HTMLInputElement>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)

  const addValue = (value: string) => {
    const trimmedValue = value.trim()
    if (
      trimmedValue &&
      !values.some((v) => v.input === trimmedValue) &&
      values.length < maxValues
    ) {
      const newAddress = { id: crypto.randomUUID(), input: trimmedValue }
      onChange([...values, newAddress])
      setInputValue('')
      onNewInput?.(newAddress)
    }
  }

  const removeValue = (valueToRemove: { id: string; input: string }) => {
    onChange(values.filter((value) => value.id !== valueToRemove.id))
    onRemoveInput?.(valueToRemove)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      addValue(inputValue)
    } else if (e.key === 'Backspace' && !inputValue && values.length > 0) {
      const lastValue = values[values.length - 1]
      if (lastValue) {
        removeValue(lastValue)
      }
    }
  }

  const handleContainerClick = () => {
    inputRef.current?.focus()
  }
  return (
    <div
      ref={containerRef}
      className="relative flex h-fit min-h-28 w-full min-w-96 cursor-text flex-wrap items-start gap-x-2 gap-y-1 overflow-hidden rounded-3xl border-2 p-3 shadow-inner focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
      onClick={handleContainerClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleContainerClick()
        }
      }}
      role="button"
      tabIndex={0}
    >
      <div className="absolute inset-0 bg-[length:90px_90px] bg-[url(/assets/grid.svg)] opacity-20 dark:bg-[url(/assets/grid-dark.svg)]" />
      {values.map((value) => (
        <Badge
          key={value.id}
          variant={errors[value.id] ? 'destructive' : 'outline'}
          className="!h-8 z-10 rounded-full bg-background pl-4 font-medium text-base shadow"
        >
          {value.input}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="ml-1 h-4 w-4 p-0 hover:bg-muted"
            onClick={(e) => {
              e.stopPropagation()
              removeValue(value)
            }}
            disabled={disabled}
            aria-label={`Remove ${value.input}`}
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
        placeholder={values.length === 0 ? placeholder : ''}
        className="!font-medium !text-base !h-8 min-w-[120px] flex-1 rounded-none border-0 p-0 shadow-none placeholder:font-medium placeholder:text-base focus-visible:ring-0 focus-visible:ring-offset-0"
        disabled={disabled || values.length >= maxValues}
      />
    </div>
  )
}
