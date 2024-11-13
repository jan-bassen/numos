import { Separator } from '@repo/ui/components/ui/separator'
import { cn } from '@repo/ui/lib/utils'
import InfoButton, {
  type InfoTooltipOptions,
} from '@repo/ui/components/help/info-tooltip'

export default function FormSegment({
  title,
  description,
  options,
  children,
  className,
  link,
}: {
  title: string
  description?: string
  options?: InfoTooltipOptions
  children?: React.ReactNode
  className?: string
  link?: {
    label: string
    href: string
  }
}) {
  return (
    <section className="flex w-full flex-col gap-1.5 py-5 first:pt-0 last:pb-0 md:gap-3 lg:flex-row">
      <h3 className="flex h-fit w-full items-center gap-2 pl-1 font-medium text-base lg:w-1/3">
        {title}
        {description && (
          <InfoButton
            title={title}
            description={description}
            options={options}
            link={link}
          />
        )}
      </h3>
      <div
        className={cn(
          'flex w-full max-w-full flex-col gap-3 px-2 py-2 md:py-4 lg:w-2/3',
          className,
        )}
      >
        {children}
      </div>
    </section>
  )
}
