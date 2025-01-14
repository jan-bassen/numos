import { FormMessage } from '@repo/ui/components/ui/form'
import { FormControl } from '@repo/ui/components/ui/form'
import {
  Select,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from '@repo/ui/components/ui/select'
import type { StageDefinition } from '@/components/forms/staged-form'
import { FormItem } from '@repo/ui/components/ui/form'
import { Zap } from 'lucide-react'
import { DetailedSelectItem } from '@/components/forms/tab-inputs/detailed-select-item'
import type { newLayerSchema } from '@/lib/schemas/layers/layer-schema'
import type { z } from 'zod'
import { layerOptionsArray } from '@/lib/constants/layers'

export const layerTypeStage: StageDefinition<
  z.infer<typeof newLayerSchema>,
  'definition.type'
> = () => {
  return {
    key: 'definition.type',
    title: 'Select the layer type',
    description:
      'Layers can have a number of different types. Select the one that best fits your use case.',
    icon: Zap,
    field: (field) => (
      <FormItem className="min-h-18 w-full">
        <Select onValueChange={field.onChange} value={field.value}>
          <FormControl>
            <SelectTrigger className={field.value ? 'h-14' : ''}>
              <SelectValue placeholder="Select Layer Type" />
            </SelectTrigger>
          </FormControl>
          <SelectContent className="min-w-44" scrollable>
            {layerOptionsArray.map((option) => {
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
