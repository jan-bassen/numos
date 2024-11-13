import { Navbar } from '@/components/nav/navbar/navbar'
import Page from '@/components/layout/pages/new-page'

export default async function Layout(props: {
  children: React.ReactNode
  params: Promise<{ collection: string }>
}) {
  const { collection } = await props.params
  const { children } = props
  return (
    <>
      <Navbar collection={collection} />
      <Page>{children}</Page>
    </>
  )
}
