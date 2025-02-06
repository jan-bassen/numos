import { Page } from '@/components/layout/page'
import { PricingHero } from './(components)/pricing-hero'
import { notFound } from 'next/navigation'

export default async function Pricing() {
  notFound()
  return (
    <Page className="min-h-screen">
      <PricingHero />
      <div />
    </Page>
  )
}
