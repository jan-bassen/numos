import { Checkbox } from '@repo/ui/components/checkbox'
import { Label } from '@repo/ui/components/label'

export function ExampleCheckbox() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center space-x-2">
        <Checkbox id="terms" />
        <Label htmlFor="terms">Accept terms</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="newsletter" defaultChecked />
        <Label htmlFor="newsletter">Subscribe</Label>
      </div>
    </div>
  )
}
