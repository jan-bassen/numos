import { FormMessage } from '@repo/ui/components/form'
import { FormControl } from '@repo/ui/components/form'
import { FormItem } from '@repo/ui/components/form'
import { Input } from '@repo/ui/components/input'
import { Tag } from 'lucide-react'
import { slugify } from '@/lib/utils'
import type { NewActionSchema } from '../new-action-dialog'
import type { StageDefinition } from '@/components/forms/staged-form'

export const nameStage: StageDefinition<NewActionSchema, 'name'> = (form) => {
  function inferSlug(name: string) {
    if (form.getFieldState('slug').isDirty) return
    form.setValue('slug', slugify(name), {
      shouldValidate: true,
      shouldDirty: false,
    })
  }
  return {
    key: 'name',
    title: 'Name your new action',
    description:
      'The name will show up throughout the studio and wherever your action is displayed. You can change it later.',
    icon: Tag,
    field: ({ value, ...field }) => (
      <FormItem className="min-h-18 w-full">
        <FormControl>
          <Input
            {...field}
            value={value || ''}
            placeholder="Name"
            onChange={(e) => {
              inferSlug(e.target.value)
              field.onChange(e)
            }}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    ),
  }
}
