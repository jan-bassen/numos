import { cn } from '@/lib/utils'

export default function TimelineItem({
  children,
  Icon,
  title,
  disabled,
}: {
  children: React.ReactNode
  Icon: React.ComponentType<any>
  title: string
  disabled?: boolean
}) {
  return (
    <div className="mt-2 grid grid-cols-[1rem_1rem_1fr] grid-rows-[2rem_1fr] gap-y-2">
      <div className="col-span-2 col-start-1 row-span-1 row-start-1">
        <Icon
          className={cn(
            'm-1.5 h-5 w-5',
            disabled ? 'stroke-border' : 'stroke-secondary-foreground',
          )}
        />
      </div>
      <div
        className={cn(
          'col-span-1 col-start-1 row-start-2 h-full w-4 border-r-1.5 ',
          disabled ? 'border-border' : 'border-muted-foreground',
        )}
      />
      <div className="col-span-1 col-start-2 row-span-1 row-start-2 h-full w-4 " />
      <div className="col-span-1 col-start-3 row-span-2 row-start-1 min-h-[80px] px-5 pb-6 pt-1">
        <h2
          className={cn(
            'mb-4 mt-0.5 text-[17px] font-semibold',
            disabled ? 'text-border' : '',
          )}
        >
          {title}
        </h2>
        <div className={disabled ? 'hidden' : ''}>{children}</div>
      </div>
    </div>
  )
}
