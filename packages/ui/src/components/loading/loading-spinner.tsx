import { cn } from '@repo/ui/lib/utils'
import { Loader2 } from 'lucide-react'

export default function LoadingSpinner({
  containerClassName,
}: {
  containerClassName?: string
  spinnerClassName?: string
}) {
  return (
    <div
      className={cn(
        'grid h-screen w-full place-items-center',

        containerClassName,
      )}
    >
      <Loader2 className={cn('size-6 animate-spin', containerClassName)} />
    </div>
  )
}
