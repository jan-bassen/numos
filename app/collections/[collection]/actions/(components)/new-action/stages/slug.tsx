import { FormMessage } from '@repo/ui/components/form'
import { FormControl } from '@repo/ui/components/form'
import { FormItem } from '@repo/ui/components/form'
import { Input } from '@repo/ui/components/input'
import { Fingerprint } from 'lucide-react'
import type { NewActionSchema } from '../new-action-dialog'
import type { StageDefinition } from '@/components/forms/staged-form'

export const slugStage: StageDefinition<NewActionSchema, 'slug'> = () => {
  return {
    key: 'slug',
    title: 'Choose a unique identifier',
    description:
      'We will use this to identify your action, so it must be unique within this collection.',
    icon: Fingerprint,
    field: ({ value, ...field }) => (
      <FormItem className="min-h-18 w-full">
        <FormControl>
          <Input {...field} value={value || ''} />
        </FormControl>
        <FormMessage />
      </FormItem>
    ),
  }
}
