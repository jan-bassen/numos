import InfoButton, {
  type TooltipInfo,
} from '@repo/ui/blocks/help/info-tooltip'
import { cn } from '@repo/ui/lib/utils'
import Link from 'next/link'

type SubheadingProps = {
  title: string
  info?: Omit<TooltipInfo, 'title'>
  link?: string
  className?: string
}

export default function Subheading({
  info,
  title,
  link,
  className,
}: SubheadingProps) {
  return (
    <div
      className={cn(
        'flex h-fit items-center gap-2 pl-1 font-medium text-base',
        className,
      )}
    >
      {link ? (
        <Link href={link} className="hover:underline">
          {title}
        </Link>
      ) : (
        <h3>{title}</h3>
      )}
      {info?.description && (
        <InfoButton
          title={title}
          description={info.description}
          options={info.options}
          link={info.link}
        />
      )}
    </div>
  )
}
