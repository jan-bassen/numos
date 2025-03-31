import { SidebarInset, SidebarProvider } from '@repo/ui/components/sidebar'
import { CollectionSidebar } from '@/app/collection/_components/sidebar/sidebar'

export default async function CollectionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <CollectionSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  )
}
