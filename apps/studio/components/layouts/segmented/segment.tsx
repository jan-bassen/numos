import { cn } from '@repo/ui/lib/utils'
import type { TooltipInfo } from '@repo/ui/components/help/info-tooltip'
import Subheading from '@/components/layouts/subheading'

type SegmentProps = {
  title: string
  children?: React.ReactNode
  className?: string
  info?: Omit<TooltipInfo, 'title'>
  link?: string
}

export default function Segment({
  info,
  title,
  children,
  className,
  link,
}: SegmentProps) {
  return (
    <section className="flex w-full flex-col gap-1.5 pt-5 first:pt-0 last:pb-0 md:gap-3 lg:flex-row lg:gap-4">
      <Subheading title={title} info={info} link={link} className="lg:w-1/3" />
      <div
        className={cn(
          'flex w-full max-w-input flex-col gap-3 py-2 md:px-2 md:py-4 lg:w-2/3',
          className,
        )}
      >
        {children}
      </div>
    </section>
  )
}
