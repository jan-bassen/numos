'use client'

import { PiMoonStroke, PiSunStroke } from '@repo/ui/icons/pika'
import { Button, type ButtonProps } from '@repo/ui/components/button'
import { useTheme } from 'next-themes'
import { cn } from '@repo/ui/lib/utils'

export function ThemeToggle({
  variant = 'ghost',
  size = 'icon',
  ...props
}: ButtonProps) {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      {...props}
      variant={variant}
      size={size}
      className={cn('max-2xs:!hidden rounded-full', props.className)}
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
