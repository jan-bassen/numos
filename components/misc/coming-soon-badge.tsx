import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@repo/ui/components/alert'
import { PiAlertCircleStroke } from '@repo/ui/icons/pika'

export function ComingSoonBadge({
  title,
  description,
}: {
  title?: string
  description?: string
}) {
  return (
    <Alert>
      <PiAlertCircleStroke className="h-4 w-4" />
      <AlertTitle>{title || 'Coming soon!'}</AlertTitle>
      <AlertDescription>
        {description ||
          'This feature is not yet available. Stay tuned for updates!'}
      </AlertDescription>
    </Alert>
  )
}
