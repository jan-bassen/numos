'use client'

import { PiArrowRightStroke, PiInformationCircleSolid } from '@/icons/pika'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@repo/ui/components/ui/popover'
import { useCallback, useRef, useState } from 'react'
import { Separator } from '@repo/ui/components/ui/separator'
import Link from 'next/link'

export type InfoTooltipOptions = { label: string; explanation: string }[]

export default function InfoButton({
  title,
  description,
  options,
  className,
  link,
}: {
  title: string
  description: string
  options?: { label: string; explanation: string }[]
  className?: string
  link?: {
    label: string
    href: string
  }
}) {
  const [open, setOpen] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleMouseEnter = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setOpen(true)
    }, 700)
  }, [])

  const handleMouseLeave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }, [])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        type="button"
        className="hidden md:block"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <PiInformationCircleSolid className="mt-0.5 h-4 w-4 text-border" />
      </PopoverTrigger>
      <PopoverContent
        className="max-w-xs space-y-3 py-3 font-normal text-popover-foreground text-xs"
        side="right"
      >
        <div className="space-y-1.5">
          <h1 className="">{title}</h1>
          <p className="">{description}</p>
        </div>
        {options && (
          <>
            <Separator />
            <ul className="mt-2 space-y-1.5 ">
              {options.map((option) => (
                <li key={option.label}>
                  <b className="underline">{option.label}:</b>{' '}
                  <p className="">{option.explanation}</p>
                </li>
              ))}
            </ul>
          </>
        )}
        {link && (
          <div className="space-y-1.5">
            <Link
              href={link.href}
              className="flex items-center gap-1.5 underline"
            >
              {link.label}
              <PiArrowRightStroke className="size-3.5" />
            </Link>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
