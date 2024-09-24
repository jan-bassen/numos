'use client'

import { useTheme } from 'next-themes'
import { MdLightMode, MdDarkMode } from 'react-icons/md'
import { useState, useEffect } from 'react'
import { Button } from '@repo/ui/components/uibutton'
import { Monitor, MoonStar, Sun } from 'lucide-react'
import {
  DropdownMenuRadioItem,
  DropdownMenuRadioGroup,
} from '@repo/ui/components/uidropdown-menu'
import { Tabs, TabsList, TabsTrigger } from '@repo/ui/components/uitabs'
import { cn } from '@/lib/utils'
import {
  PiMonitor01Solid,
  PiMonitor01Stroke,
  PiMoonSolid,
  PiMoonStroke,
  PiSunSolid,
  PiSunStroke,
} from '@/lib/icons'

export function ThemeTabSelect() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <Tabs
      defaultValue={theme}
      onValueChange={(v) => {
        setTheme(v)
        localStorage.setItem('theme', v)
      }}
    >
      <TabsList className="h-9 w-full gap-1 bg-transparent px-1">
        <TabsTrigger
          value="light"
          className={cn(
            'w-full hover:bg-muted',
            theme === 'light' && '!bg-muted',
          )}
        >
          {theme === 'light' ? (
            <PiSunSolid className="my-auto h-4  w-4" />
          ) : (
            <PiSunStroke className="my-auto h-4  w-4" />
          )}
        </TabsTrigger>
        <TabsTrigger
          value="dark"
          className={cn(
            'w-full hover:bg-muted',
            theme === 'dark' && '!bg-muted',
          )}
        >
          {theme === 'dark' ? (
            <PiMoonSolid className="my-auto h-4  w-4" />
          ) : (
            <PiMoonStroke className="my-auto h-4  w-4" />
          )}
        </TabsTrigger>
        <TabsTrigger
          value="system"
          className={cn(
            'w-full hover:bg-muted',
            theme === 'system' && '!bg-muted',
          )}
        >
          {theme === 'system' ? (
            <PiMonitor01Solid className="my-auto h-4  w-4" />
          ) : (
            <PiMonitor01Stroke className="my-auto h-4  w-4" />
          )}
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
