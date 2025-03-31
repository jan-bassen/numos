'use client'

import { cn } from '@repo/ui/lib/utils'
import { Button } from '@repo/ui/components/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/card'
import { PiGoogle, PiXComStroke } from '@repo/ui/icons/pika'
import Link from 'next/link'

type AuthFormProps = React.ComponentPropsWithoutRef<'div'> & {
  title: string
  description: string
  link: {
    prefix: string
    text: string
    href: string
  }
  twitter: { action: () => Promise<void>; text: string }
  google: { action: () => Promise<void>; text: string }
  children?: React.ReactNode
}

export function AuthForm({
  className,
  title,
  description,
  link,
  twitter,
  google,
  children,
  ...props
}: AuthFormProps) {
  return (
    <div
      className={cn('flex flex-col items-center gap-4', className)}
      {...props}
    >
      <Card className="bg-card sm:min-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="font-bold font-heading text-xl">
            {title}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="flex flex-col gap-3">
              <Button
                variant="outline"
                className="w-full"
                onClick={twitter.action}
              >
                <PiXComStroke className="size-4" />
                {twitter.text}
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={google.action}
              >
                <PiGoogle className="size-4" />
                {google.text}
              </Button>
            </div>
            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-border after:border-t">
              <span className="relative z-10 bg-background px-2 text-muted-foreground">
                or continue with
              </span>
            </div>
            {children}
            <div className="text-center text-sm">
              {`${link.prefix} `}
              <Link
                href={link.href}
                className="underline underline-offset-4 hover:text-primary"
              >
                {link.text}
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="max-w-xs text-balance text-center text-muted-foreground text-xs [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary ">
        By clicking continue, you agree to our{' '}
        <Link href="#">Terms of Service</Link> and{' '}
        <Link href="#">Privacy Policy</Link>.
      </div>
    </div>
  )
}
