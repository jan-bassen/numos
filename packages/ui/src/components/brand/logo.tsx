import { cn } from '@repo/ui/lib/utils'
import Image from 'next/image'

export default function Logo({
  name = true,
  size = 100,
  className,
}: {
  size?: number
  name?: boolean
  className?: string
}) {
  if (!name) {
    return (
      <>
        <Image
          src="/brand/icon_white.svg"
          className={cn('hidden dark:block', className)}
          alt="logo"
          width={size * 5}
          height={size}
        />
        <Image
          src="/brand/icon_black.svg"
          className={cn(' dark:hidden', className)}
          alt="logo"
          width={size * 5}
          height={size}
        />
      </>
    )
  }
  return (
    <>
      <Image
        src="/brand/logo_white.svg"
        className={cn('hidden dark:block', className)}
        alt="logo"
        width={size}
        height={size}
      />
      <Image
        src="/brand/logo_black.svg"
        className={cn('dark:hidden', className)}
        alt="logo"
        width={size}
        height={size}
      />
    </>
  )
}
