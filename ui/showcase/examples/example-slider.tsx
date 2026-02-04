import { Slider } from '@repo/ui/components/slider'

export function ExampleSlider() {
  return (
    <div className="w-full max-w-[200px] space-y-4">
      <Slider defaultValue={[50]} max={100} step={1} />
      <Slider defaultValue={[25, 75]} max={100} step={1} />
    </div>
  )
}
