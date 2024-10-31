'use client'

import { Button, type ButtonProps } from '@repo/ui/components/ui/button'
import { Input, type InputProps } from '@repo/ui/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@repo/ui/components/ui/popover'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@repo/ui/components/ui/tabs'
import { Textarea } from '@repo/ui/components/ui/textarea'
import { generateCron } from '@/lib/ai/cron'
import { cn } from '@repo/ui/lib/utils'
import { Loader2 } from 'lucide-react'
import { useState, useTransition } from 'react'
import type { FieldError } from 'react-hook-form'
import { toast } from 'sonner'

export type CronObject = {
  schedule?: string
  description?: string
}

export type CronInputProps = {
  button: ButtonProps
  input: InputProps
  field: {
    value?: CronObject
    onChange: (value?: CronObject) => void
    onBlur: (value?: CronObject) => void
  }
  state: {
    invalid: boolean
    isDirty: boolean
    isTouched: boolean
    isValidating: boolean
    error?: FieldError
  }
  validate: (value: CronObject) => Promise<boolean>
}

export default function CronInput({
  button,
  input,
  field,
  state,
  validate,
}: CronInputProps) {
  const [prompt, setPrompt] = useState<string>('')
  const [isPending, startTransition] = useTransition()

  async function generate() {
    startTransition(async () => {
      const res = await generateCron(prompt)
      if (res.type === 'success') {
        const cron: CronObject = {
          schedule: res.data.schedule,
          description: res.data.description,
        }
        field.onChange(cron)
        validate(cron)
        if (res.data.message)
          toast.warning(res.data.message, { duration: 5000, closeButton: true })
      }
      if (res.type === 'error') {
        toast.error(res.message)
      }
    })
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          {...button}
          className={cn(
            'h-13 flex-col py-1',
            state.invalid && 'border-destructive text-destructive',
            button.className,
          )}
        >
          {isPending ? (
            <div className="flex gap-2">
              <Loader2 className="size-4 animate-spin" />
              <span>Generating</span>
            </div>
          ) : field.value?.schedule ? (
            field.value.description ? (
              <>
                <h3 className="font-semibold">{field.value.schedule}</h3>
                <p className="text-muted-foreground text-sm italic">
                  {field.value.description || 'No description provided'}
                </p>
              </>
            ) : (
              field.value.schedule
            )
          ) : (
            'Define Schedule'
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="space-y-2">
        <Tabs defaultValue="ai">
          <TabsList className="w-full">
            <TabsTrigger value="ai" className="w-full">
              AI
            </TabsTrigger>
            <TabsTrigger value="manual" className="w-full">
              Manual
            </TabsTrigger>
          </TabsList>
          <TabsContent value="ai" className="space-y-2">
            <Textarea
              className="h-12 w-full"
              placeholder="Describe your schedule and we will generate it for you"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <Button
              form="cron-ai-form"
              type="submit"
              variant="secondary"
              className="w-full"
              onClick={() => generate()}
            >
              Generate
            </Button>
          </TabsContent>
          <TabsContent value="manual" className="space-y-2">
            <Input
              {...input}
              onChange={(e) =>
                field.onChange({
                  schedule: e.target.value,
                  description: field.value?.description,
                })
              }
              onBlur={() => field.onBlur(field.value)}
              value={field.value?.schedule}
              placeholder='e.g. "0 0 * * * *"'
            />
            <Textarea
              onChange={(e) =>
                field.onChange({
                  schedule: field.value?.schedule,
                  description: e.target.value,
                })
              }
              value={field.value?.description}
              placeholder='e.g. "Every first day of the month at 10am"'
            />
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  )
}
