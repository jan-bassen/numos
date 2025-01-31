import { FormMessage } from '@repo/ui/components/ui/form'
import { FormControl } from '@repo/ui/components/ui/form'
import {
  Select,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from '@repo/ui/components/ui/select'
import { FormItem } from '@repo/ui/components/ui/form'
import { Zap } from 'lucide-react'
import { triggerOptionsArray } from '@/lib/constants/triggers'
import { DetailedSelectItem } from '@/components/forms/tab-inputs/detailed-select-item'
import type { NewActionSchema } from '../new-action-dialog'
import type { StageDefinition } from '@/components/forms/staged-form'
import { defaultTriggerSettings } from '@/lib/defaults/actions/trigger-settings'
import type { TriggerType } from '@/types/database.types'

export const triggerStage: StageDefinition<NewActionSchema, 'trigger'> = () => {
  return {
    key: 'trigger',
    title: 'Select what triggers the action',
    description:
      'Actions can be triggered by a number of different events. Select the one that best fits your use case.',
    icon: Zap,
    field: (field) => (
      <FormItem className="min-h-18 w-full">
        <Select
          onValueChange={(value) => {
            const defaultTrigger =
              value && !!defaultTriggerSettings[value as TriggerType]
                ? defaultTriggerSettings[value as TriggerType]
                : undefined
            field.onChange(defaultTrigger)
          }}
          value={field.value?.type}
        >
          <FormControl>
            <SelectTrigger className={field.value ? 'h-14' : ''}>
              <SelectValue placeholder="Select Trigger" />
            </SelectTrigger>
          </FormControl>
          <SelectContent className="min-w-44" scrollable>
            {triggerOptionsArray.map((option) => {
              return (
                <DetailedSelectItem
                  key={`key-${option.value}`}
                  option={option}
                />
              )
            })}
          </SelectContent>
        </Select>
        <FormMessage />
      </FormItem>
    ),
  }
}
