import { ThemeToggle } from '@/components/theme-toggle'
import { Grid } from '@repo/ui/blocks/backgrounds/grid'
import Logo from '@repo/ui/blocks/brand/logo'
import Link from 'next/link'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <Link href="/">
        <Logo name className="absolute top-4 left-4 h-6 w-auto" />
      </Link>
      <ThemeToggle className="absolute top-4 right-4 " />
      {children}
      <Grid />
    </div>
  )
}
