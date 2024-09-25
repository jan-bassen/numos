'use client'

import type { LocationInputProps } from '../generic-input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@repo/ui/components/ui/popover'
import { type FormEvent, useEffect, useMemo, useRef, useState } from 'react'
import type { Location } from '@/types/database.types'
import { Button, buttonVariants } from '@repo/ui/components/ui/button'
import {
  APIProvider,
  Map as GoogleMap,
  Marker,
} from '@vis.gl/react-google-maps'
import { fromAddress, fromLatLng, setKey, setLanguage } from 'react-geocode'
import { Input } from '@repo/ui/components/ui/input'
import { PiSearchDefaultStroke } from '@repo/ui/icons/pika'
import { cn } from '@/lib/utils'
import { Drag } from 'rete-react-plugin'
import { getAddressFromGeocoder } from '../utils'
import { locationSchema } from '../schemas'

export default function LocationInput({
  value,
  onValueChange,
  onChange,
  locked,
  className,
  environment,
  valid,
  ...props
}: LocationInputProps) {
  console.log(value)
  const location: Location | null = useMemo(() => {
    return locationSchema.optional().nullable().parse(value) || null
  }, [value])

  const [zoom, setZoom] = useState(2)
  const [address, setAddress] = useState<string>('')
  const [center, setCenter] = useState<Location | null>(location)

  const dragRef = useRef<any>(null)
  Drag.useNoDrag(dragRef)

  useEffect(() => {
    if (!location) {
      setCenter(null)
      setAddress('')
      return
    }
    fromLatLng(location.lat, location.lng)
      .then(({ results }) => {
        setAddress(getAddressFromGeocoder(results, location).long)
      })
      .catch((e) => {
        throw e
      })
  }, [location])

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  if (!apiKey) return null

  setKey(apiKey)
  setLanguage('en')

  function handleAddressInput(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    e.stopPropagation()
    const input = e.currentTarget[0] as HTMLInputElement
    const address = input.value
    if (!address) return
    fromAddress(address)
      .then(({ results }) => {
        const location = results[0].geometry.location
        if (!location || locked) return
        const newLocation: Location = {
          lat: location.lat,
          lng: location.lng,
        }
        onValueChange?.(newLocation)
        onChange?.(newLocation)
        setCenter({
          lat: location.lat,
          lng: location.lng,
        })
        setZoom(7)
      })
      .catch((e) => {
        throw e
      })
  }

  return (
    <Popover>
      <span ref={environment === 'node' ? dragRef : undefined}>
        <PopoverTrigger
          id={props.id}
          disabled={locked}
          className={cn(
            buttonVariants({ variant: 'outline' }),
            '!line-clamp-1 h-10 w-full overflow-hidden text-ellipsis text-nowrap font-normal',
            environment === 'node' &&
              'h-7 max-w-52 items-center rounded-lg px-2 py-0 text-sm',
            valid === false && 'border-warning bg-warning/10',
            className,
          )}
        >
          {address || 'Set Location'}
        </PopoverTrigger>
        <PopoverContent
          side="top"
          sideOffset={6}
          className="m-1 w-fit max-w-[100vw] overflow-hidden rounded-lg border-none p-0"
        >
          <APIProvider apiKey={apiKey}>
            <GoogleMap
              style={{ width: '25rem', height: '20rem' }}
              defaultCenter={location || undefined}
              center={center || undefined}
              onCenterChanged={(e) => {
                setCenter({
                  lat: e.detail.center?.lat || 0,
                  lng: e.detail.center?.lng || 0,
                })
              }}
              onClick={(e) => {
                if (locked) return
                const newLocation: Location = {
                  lat: e.detail.latLng?.lat || 0,
                  lng: e.detail.latLng?.lng || 0,
                }
                onValueChange?.(newLocation)
                onChange?.(newLocation)
              }}
              defaultZoom={3}
              zoom={zoom}
              onZoomChanged={(e) => setZoom(e.detail.zoom)}
              gestureHandling={'greedy'}
              disableDefaultUI={true}
            >
              <Marker position={location} />
            </GoogleMap>
          </APIProvider>
          <form
            className="flex"
            id="searchAddress"
            onSubmit={handleAddressInput}
          >
            <Input
              className="w-full rounded-none border-none"
              placeholder={address}
            />
            <Button
              className="flex h-10 items-center rounded-none"
              variant={'ghost'}
              type="submit"
              form="searchAddress"
            >
              <PiSearchDefaultStroke className="size-5" />
            </Button>
          </form>
        </PopoverContent>
      </span>
    </Popover>
  )
}
