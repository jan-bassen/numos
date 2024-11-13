import { Button, type ButtonProps } from '@repo/ui/components/ui/button'
import { PiCheckTickSquareBrokenStroke } from '@repo/ui/icons/pika'
import { cn } from '@repo/ui/lib/utils'

export default function SaveButton({ className, ...props }: ButtonProps) {
  return (
    <Button {...props} className={cn('gap-2', className)}>
      <PiCheckTickSquareBrokenStroke className="size-4" />
      Save
    </Button>
  )
}
