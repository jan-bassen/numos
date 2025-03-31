import { Label } from '@repo/ui/components/label'
import { Switch } from '@repo/ui/components/switch'

export function ExampleSwitch() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center space-x-2">
        <Switch id="airplane-mode" />
        <Label htmlFor="airplane-mode">Airplane Mode</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch id="dark-mode" defaultChecked />
        <Label htmlFor="dark-mode">Dark Mode</Label>
      </div>
    </div>
  )
}
