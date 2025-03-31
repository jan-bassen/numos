import { Grid } from '@repo/ui/blocks/backgrounds/grid'
import Logo from '@repo/ui/blocks/brand/logo'
import Link from 'next/link'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@repo/ui/components/button'

export default function LoginPage() {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <Link href="/">
        <Logo name className="absolute top-4 left-4 h-6 w-auto" />
      </Link>
      <ThemeToggle className="absolute top-4 right-4 " />
      <div className="flex flex-col items-center gap-6 ">
        <div className="flex w-full flex-col items-center gap-1">
          <h1 className="font-bold text-2xl">Unauthorized</h1>
          <p className="text-muted-foreground text-sm">
            Please log in to access this page
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Link href="/signup">Sign up</Link>
          </Button>
          <Button>
            <Link href="/login">Login</Link>
          </Button>
        </div>
      </div>
      <Grid />
    </div>
  )
}
