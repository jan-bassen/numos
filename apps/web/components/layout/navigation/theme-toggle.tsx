'use client'

import { PiMoonStroke, PiSunStroke } from '@repo/ui/icons/pika'

import { Button } from '@repo/ui/components/ui/button'

import { useTheme } from 'next-themes'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      className="-2xs:!hidden rounded-full"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      {theme === 'dark' ? (
        <PiSunStroke className="size-4" />
      ) : (
        <PiMoonStroke className="size-4" />
      )}
    </Button>
  )
}
