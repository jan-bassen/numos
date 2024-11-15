import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@repo/ui/components/ui/alert'
import { PiAlertCircleStroke } from '@repo/ui/icons/pika'

export default function ComingSoonBadge() {
  return (
    <Alert>
      <PiAlertCircleStroke className="h-4 w-4" />
      <AlertTitle>Coming soon!</AlertTitle>
      <AlertDescription>
        This feature is not yet available. Stay tuned for updates!
      </AlertDescription>
    </Alert>
  )
}
