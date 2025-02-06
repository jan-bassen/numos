import { cn } from '@repo/ui/lib/utils'
import type { Dictionary } from '@/dictionaries/dictionaries'

export function Benefits({
  dictionary,
}: { dictionary: Dictionary['home']['benefits'] }) {
  return (
    <div className="group flex -md:h-[36rem] w-full max-w-5xl -md:flex-col items-center">
      {dictionary.benefits.benefits.map((benefit, i) => (
        <div
          key={benefit.title}
          className={cn(
            'relative w-full flex-[0.14285714] -md:py-1 transition-all duration-300 hover:flex-[0.7] md:px-2',
            i === 0 &&
              '-md:hover:!flex-[0.7] -md:flex-[0.7] -md:group-hover:flex-[0.14285714]',
            i === 3 &&
              'md:hover:!flex-[0.7] md:flex-[0.7] md:group-hover:flex-[0.14285714]',
          )}
        >
          <div className="h-full rounded-home_mobile border border-border bg-muted md:h-[28rem] md:rounded-home" />
        </div>
      ))}
    </div>
  )
}
