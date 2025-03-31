import { Separator } from '@repo/ui/components/separator'

export function ExampleSeparator() {
  return (
    <div className="w-full max-w-[200px] space-y-4">
      <div className="space-y-1">
        <h4 className="text-sm font-medium">Horizontal Separator</h4>
        <Separator />
      </div>
      <div className="flex h-5 items-center space-x-4 text-sm">
        <div>Left</div>
        <Separator orientation="vertical" />
        <div>Right</div>
      </div>
    </div>
  )
}
