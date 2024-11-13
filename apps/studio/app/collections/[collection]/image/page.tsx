import { redirect } from 'next/navigation'

export default async function Home({
  params,
}: { params: Promise<{ collection: string }> }) {
  const { collection } = await params
  redirect(`/collections/${collection}/image/image`)
}
