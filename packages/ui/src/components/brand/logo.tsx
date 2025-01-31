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
          src="/logo_black_200.svg"
          className={cn('hidden dark:block', className)}
          alt="logo"
          width={size}
          height={size}
        />
        <Image
          src="/logo_white_200.svg"
          className={cn('dark:hidden', className)}
          alt="logo"
          width={size}
          height={size}
        />
      </>
    )
  }
  return (
    <span className="flex items-center gap-1.5">
      <Image
        src="/logo_black_200.svg"
        className={cn('hidden dark:block', className)}
        alt="logo"
        width={size * 5}
        height={size}
      />
      <Image
        src="/logo_white_200.svg"
        className={cn(' dark:hidden', className)}
        alt="logo"
        width={size * 5}
        height={size}
      />
      <h1 className="font-extrabold font-poppins text-2xl text-primary">
        NUMOS
      </h1>
    </span>
  )
}
