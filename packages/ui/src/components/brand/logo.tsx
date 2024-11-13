import { cn } from '@repo/ui/lib/utils'
import Image from 'next/image'

export default function Logo({
  size = 100,
  name = false,
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
          src="/numos_dark.svg"
          className={cn('hidden size-8 dark:block', className)}
          alt="logo"
          width={size}
          height={size}
        />
        <Image
          src="/numos_light.svg"
          className={cn('size-8 dark:hidden', className)}
          alt="logo"
          width={size}
          height={size}
        />
      </>
    )
  }
  return (
    <span className="flex items-center gap-3">
      <Image
        src="/numos_dark.svg"
        className={cn('hidden size-8 dark:block', className)}
        alt="logo"
        width={size}
        height={size}
      />
      <Image
        src="/numos_light.svg"
        className={cn('size-8 dark:hidden', className)}
        alt="logo"
        width={size}
        height={size}
      />
      <span className="pb-1.5 font-outfit text-3xl font-bold">numos</span>
    </span>
  )
}
