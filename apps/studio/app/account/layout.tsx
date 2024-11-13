import Page from '@/components/layout/pages/new-page'
import { Navbar } from '@/components/nav/navbar/navbar'

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
