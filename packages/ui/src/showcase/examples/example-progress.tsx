import { Progress } from '@repo/ui/components/progress'

export function ExampleProgress() {
  return (
    <div className="w-full max-w-[300px] space-y-4">
      <Progress value={33} className="h-2" />
      <Progress value={66} className="h-2" />
      <Progress value={100} className="h-2" />
    </div>
  )
}
