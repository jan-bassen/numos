import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@repo/ui/components/tabs'

export function ExampleTabs() {
  return (
    <Tabs defaultValue="account" className="w-full max-w-[300px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account" className="p-2">
        Account settings content.
      </TabsContent>
      <TabsContent value="password" className="p-2">
        Password change content.
      </TabsContent>
    </Tabs>
  )
}
