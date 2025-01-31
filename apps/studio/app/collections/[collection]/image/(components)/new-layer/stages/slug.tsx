import { FormMessage } from '@repo/ui/components/ui/form'
import { FormControl } from '@repo/ui/components/ui/form'
import { FormItem } from '@repo/ui/components/ui/form'
import { Input } from '@repo/ui/components/ui/input'
import { Fingerprint } from 'lucide-react'
import type { NewLayerSchema } from '@/app/collections/[collection]/image/(components)/new-layer/new-layer-dialog'
import type { StageDefinition } from '@/components/forms/staged-form'

export const slugStage: StageDefinition<NewLayerSchema, 'slug'> = () => {
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
