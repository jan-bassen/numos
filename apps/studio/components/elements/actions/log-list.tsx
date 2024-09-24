import { cn } from '@/lib/utils'

export default function LogsList({ logs }: { logs: string[] }) {
  const lastIndex = logs.length - 1
  return (
    <ul className="pl-2">
      {logs.map((log, index) => {
        if (typeof log !== 'string' && log === '') return null
        return (
          <li
            className={cn(
              'relative flex shrink-0 items-center gap-3 border-border-highlight border-l-2 py-1 text-sm ',
              (index === 0 || index === lastIndex) && 'border-background',
            )}
            key={log}
          >
            {index === 0 && (
              <div className="-translate-x-0.5 absolute bottom-0 left-0 h-1/2 w-0.5 bg-border-highlight" />
            )}
            {index === lastIndex && (
              <div className="-translate-x-0.5 absolute top-0 left-0 h-1/2 w-0.5 shrink-0 bg-border-highlight" />
            )}
            <div
              className={cn(
                '-translate-x-[0.3rem] size-2 shrink-0 rounded-full bg-border-highlight',
                (index === 0 || index === lastIndex) && 'bg-border-highlight',
              )}
            />
            {log}
          </li>
        )
      })}
    </ul>
  )
}
