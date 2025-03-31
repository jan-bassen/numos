import { Button } from '@repo/ui/components/button'

export function ExampleButton() {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex gap-2">
        <Button variant="default">Default</Button>
        <Button variant="secondary">Secondary</Button>
      </div>
      <div className="mt-2 flex gap-2">
        <Button variant="destructive">Destructive</Button>
        <Button variant="outline">Outline</Button>
      </div>
      <div className="mt-2 flex gap-2">
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
      </div>
    </div>
  )
}
