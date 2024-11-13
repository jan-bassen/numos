'use client'

import * as React from 'react'
import { OTPInput, OTPInputContext } from 'input-otp'
import { Dot } from 'lucide-react'

import { cn } from '@repo/ui/lib/utils'

const InputOTP = React.forwardRef<
  React.ElementRef<typeof OTPInput>,
  React.ComponentPropsWithoutRef<typeof OTPInput>
>(({ className, containerClassName, ...props }, ref) => (
  <OTPInput
    ref={ref}
    containerClassName={cn(
      'flex items-center gap-2 has-[:disabled]:opacity-50',
      containerClassName,
    )}
    className={cn('disabled:cursor-not-allowed', className)}
    {...props}
  />
))
InputOTP.displayName = 'InputOTP'

const InputOTPGroup = ({
  className,
  ...props
}: React.ComponentProps<'div'>) => (
  <div className={cn('flex items-center', className)} {...props} />
)
InputOTPGroup.displayName = 'InputOTPGroup'

type InputOTPSlotProps = React.ComponentPropsWithoutRef<'div'> & {
  index: number
}
const InputOTPSlot = ({ index, className, ...props }: InputOTPSlotProps) => {
  const inputOTPContext = React.useContext(OTPInputContext)
  const slot = inputOTPContext.slots[index]
  if (!slot) return null
  const { char, hasFakeCaret, isActive } = slot

  return (
    <div
      className={cn(
        'relative flex h-10 w-10 items-center justify-center border-input border-y border-r text-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md',
        isActive && 'z-10 ring-2 ring-ring ring-offset-background',
        className,
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px animate-caret-blink bg-foreground duration-1000" />
        </div>
      )}
    </div>
  )
}
InputOTPSlot.displayName = 'InputOTPSlot'

const InputOTPSeparator = ({ ...props }: React.ComponentProps<'div'>) => (
  <div role="separator" {...props}>
    <Dot />
  </div>
)
InputOTPSeparator.displayName = 'InputOTPSeparator'

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }
