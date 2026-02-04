import { cn } from '@repo/ui/lib/utils'
import Image from 'next/image'

export default function Logo({
  name,
  size = 400,
  className,
}: {
  size?: number
  name?: boolean
  className?: string
}) {
  if (!name) {
    return (
      <div className={cn('relative h-[400px] overflow-hidden', className)}>
        <Image
          src="/brand/icon_white.svg"
          className="hidden h-full w-auto dark:block"
          alt="logo"
          width={size * 5}
          height={size}
        />
        <Image
          src="/brand/icon_black.svg"
          className="h-full w-auto dark:hidden"
          alt="logo"
          width={size * 5}
          height={size}
        />
      </div>
    )
  }
  return (
    <div className={cn('relative h-[400px] overflow-hidden', className)}>
      <Image
        src="/brand/logo_white.svg"
        className="hidden h-full w-auto dark:block"
        alt="logo"
        width={size}
        height={size}
      />
      <Image
        src="/brand/logo_black.svg"
        className="h-full w-auto dark:hidden"
        alt="logo"
        width={size}
        height={size}
      />
    </div>
  )
}
