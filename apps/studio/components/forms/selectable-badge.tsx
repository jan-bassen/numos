import { Badge, type BadgeVariant } from '@repo/ui/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@repo/ui/components/ui/dropdown-menu'
import { PiChevronBigDownStroke } from '@repo/ui/icons/pika'
import { cn } from '@repo/ui/lib/utils'
import type { ReactNode } from 'react'

export default function SelectableBadge({
  value,
  options,
  onValueChange,
  variant,
  children,
  className,
}: {
  value: string
  options: { value: string; label: string }[]
  onValueChange: (value: string) => void
  variant?: BadgeVariant
  children: ReactNode
  className?: string
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Badge
          variant={variant}
          className={cn('flex cursor-pointer gap-1', className)}
        >
          {children}
          <PiChevronBigDownStroke className="size-3" />
        </Badge>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-40">
        <DropdownMenuRadioGroup value={value} onValueChange={onValueChange}>
          {options.map((option) => (
            <DropdownMenuRadioItem
              indicator={true}
              key={option.value}
              value={option.value}
            >
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
