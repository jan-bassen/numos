import { Label } from '@repo/ui/components/label'
import { RadioGroup, RadioGroupItem } from '@repo/ui/components/radio-group'

export function ExampleRadioGroup() {
  return (
    <RadioGroup defaultValue="option-one" className="w-full max-w-[200px]">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-one" id="option-one" />
        <Label htmlFor="option-one">Option One</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-two" id="option-two" />
        <Label htmlFor="option-two">Option Two</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-three" id="option-three" />
        <Label htmlFor="option-three">Option Three</Label>
      </div>
    </RadioGroup>
  )
}
