import { cn } from '@repo/ui/lib/utils'
import Image from 'next/image'

export default function LogoIcon({
  size = 100,
  className,
}: {
  size?: number
  name?: boolean
  className?: string
}) {
  return (
    <>
      <Image
        src="/logo_white_200.svg"
        className={cn('hidden size-8 dark:block', className)}
        alt="logo"
        width={size}
        height={size}
      />
      <Image
        src="/logo_black_200.svg"
        className={cn('size-8 dark:hidden', className)}
        alt="logo"
        width={size}
        height={size}
      />
    </>
  )
}
