'use client'

import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'
import { Button } from '@repo/ui/components/ui/button'
import {
  DropdownMenuRadioItem,
  DropdownMenuRadioGroup,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from '@repo/ui/components/ui/dropdown-menu'
import {
  PiMonitor01Solid,
  PiMonitor01Stroke,
  PiMoonSolid,
  PiMoonStroke,
  PiSunSolid,
  PiSunStroke,
} from '@repo/ui/icons/pika'

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={'ghost'} className="px-2">
          {theme === 'light' ? (
            <PiSunStroke className="my-auto h-4  w-4" />
          ) : theme === 'dark' ? (
            <PiMoonStroke className="my-auto h-4  w-4" />
          ) : (
            <PiMonitor01Stroke className="my-auto h-4  w-4" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="left" align="start">
        <DropdownMenuRadioGroup
          value={theme}
          onValueChange={(v) => {
            setTheme(v)
            localStorage.setItem('theme', v)
          }}
        >
          <DropdownMenuRadioItem
            value="light"
            className="flex gap-2 px-4"
            indicator={false}
          >
            {theme === 'light' ? (
              <PiSunSolid className="my-auto h-4  w-4" />
            ) : (
              <PiSunStroke className="my-auto h-4  w-4" />
            )}
            Light
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            value="dark"
            className="flex gap-2 px-4"
            indicator={false}
          >
            {theme === 'dark' ? (
              <PiMoonSolid className="my-auto h-4  w-4" />
            ) : (
              <PiMoonStroke className="my-auto h-4  w-4" />
            )}
            Dark
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            value="system"
            className="flex gap-2 px-4"
            indicator={false}
          >
            {theme === 'system' ? (
              <PiMonitor01Solid className="my-auto h-4  w-4" />
            ) : (
              <PiMonitor01Stroke className="my-auto h-4  w-4" />
            )}
            System
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
