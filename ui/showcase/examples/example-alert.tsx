import { Alert, AlertDescription, AlertTitle } from '@repo/ui/components/alert'
import { InfoIcon } from 'lucide-react'

export function ExampleAlert() {
  return (
    <Alert className="w-full max-w-[300px]">
      <InfoIcon className="h-4 w-4" />
      <AlertTitle>Information</AlertTitle>
      <AlertDescription>This is an example alert message.</AlertDescription>
    </Alert>
  )
}
