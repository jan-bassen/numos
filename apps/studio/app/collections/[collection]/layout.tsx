import { Navbar } from '@/components/navigation/navbar/navbar'
import Page from '@/components/page/page'

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
