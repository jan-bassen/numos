import { Page } from '@/components/page/page'
import { Navbar } from '@/components/navigation/navbar/navbar'

export default function UserLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <Page>{children}</Page>
    </>
  )
}
