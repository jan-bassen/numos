import { Button, type ButtonProps } from '@repo/ui/components/ui/button'
import { PiRefreshStroke } from '@repo/ui/icons/pika'
import { cn } from '@repo/ui/lib/utils'

export default function ResetButton({ className, ...props }: ButtonProps) {
  return (
    <Button variant={'outline'} {...props} className={cn('gap-2', className)}>
      <PiRefreshStroke className="size-4" />
      Reset
    </Button>
  )
}
