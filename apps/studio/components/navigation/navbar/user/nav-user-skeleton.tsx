import { SidebarMenuButton } from '@repo/ui/components/ui/sidebar'
import { Skeleton } from '@repo/ui/components/ui/skeleton'
import { ChevronsUpDown } from 'lucide-react'

export function NavUserSkeleton() {
  return (
    <SidebarMenuButton
      size="lg"
      className="hover:bg-transparent data-[state=open]:bg-sidebar-accent"
    >
      <Skeleton className="size-8 shrink-0 rounded-lg object-contain" />
      <div className="flex flex-col gap-1.5">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-32" />
      </div>
      <ChevronsUpDown className="ml-auto size-4 text-primary/40" />
    </SidebarMenuButton>
  )
}
