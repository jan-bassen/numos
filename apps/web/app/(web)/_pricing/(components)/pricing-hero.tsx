import { Card } from '@repo/ui/components/card'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@repo/ui/components/tabs'

export function PricingHero() {
  return (
    <div className="flex w-full flex-col items-center space-y-10">
      <div className="flex w-full flex-col items-center space-y-4">
        <h1 className="w-full text-center font-black text-4xl md:text-5xl">
          No surprises, no bullsh*t
        </h1>
        <p className="w-full max-w-xl text-center text-muted-foreground md:text-lg">
          We follow a strict policy of simple and pragmatic pricing. Have
          predictable costs, but only pay for what you need.
        </p>
      </div>
      <Tabs
        defaultValue="yearly"
        className="flex w-full max-w-5xl flex-col items-center"
      >
        <TabsList className="mb-4">
          <TabsTrigger value="monthly" className="w-20">
            Monthly
          </TabsTrigger>
          <TabsTrigger value="yearly" className="w-20">
            Yearly
          </TabsTrigger>
        </TabsList>
        <TabsContent
          value="monthly"
          className="flex w-full gap-4 data-[state=inactive]:hidden"
        >
          <Card className="h-96 w-full rounded-2xl md:rounded-4xl" />
          <Card className="h-96 w-full rounded-2xl md:rounded-4xl" />
          <Card className="h-96 w-full rounded-2xl md:rounded-4xl" />
        </TabsContent>
        <TabsContent
          value="yearly"
          className="flex w-full gap-4 data-[state=inactive]:hidden"
        >
          <Card className="h-96 w-full rounded-2xl md:rounded-4xl" />
          <Card className="h-96 w-full rounded-2xl md:rounded-4xl" />
          <Card className="h-96 w-full rounded-2xl md:rounded-4xl" />
        </TabsContent>
      </Tabs>
    </div>
  )
}
