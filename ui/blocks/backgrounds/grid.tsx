import { cn } from '@repo/ui/lib/utils'

export function Grid({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'bg-(image:--dots-grid) -z-10 absolute inset-0 bg-[length:80px_80px] opacity-20',
        className,
      )}
    />
  )
}
