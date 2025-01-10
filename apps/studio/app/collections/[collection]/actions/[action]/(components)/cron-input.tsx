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
import { toast } from 'sonner'
import { Label } from '@repo/ui/components/ui/label'

export type CronObject = {
  schedule?: string
  description?: string
}

export type CronInputProps = {
  id?: string
  button: ButtonProps
  input: InputProps
  value?: CronObject
  valid?: boolean
  onChange: (value?: CronObject) => void
}

export default function CronInput({
  id,
  value,
  onChange,
  button,
  input,
  valid,
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
        onChange(cron)
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
          id={id}
          type="button"
          {...button}
          className={cn(
            'h-13 flex-col py-1',
            valid === false && 'border-destructive text-destructive',
            button.className,
          )}
        >
          {isPending ? (
            <div className="flex gap-2">
              <Loader2 className="size-4 animate-spin" />
              <span>Generating</span>
            </div>
          ) : value?.schedule ? (
            value.description ? (
              <>
                <h3 className="font-semibold">{value.schedule}</h3>
                <p className="text-muted-foreground text-sm italic">
                  {value.description || 'No description provided'}
                </p>
              </>
            ) : (
              value.schedule
            )
          ) : (
            'Define Schedule'
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="min-h-64 p-3">
        <Tabs defaultValue="ai" className="flex flex-col justify-between gap-2">
          <TabsList className="w-full">
            <TabsTrigger value="ai" className="w-full">
              AI
            </TabsTrigger>
            <TabsTrigger value="manual" className="w-full">
              Manual
            </TabsTrigger>
          </TabsList>
          <TabsContent value="ai" className="space-y-2">
            <div className="space-y-0.5">
              <Label
                htmlFor="cron-prompt"
                className="pl-0.5 text-muted-foreground text-sm"
              >
                Prompt
              </Label>
              <Textarea
                id="cron-prompt"
                className="min-h-24 w-full"
                placeholder="Describe the schedule you want to generate. Example: Every first day of the month at 10am"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>
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
            <div className="space-y-0.5">
              <Label
                htmlFor="cron-schedule"
                className="pl-0.5 text-muted-foreground text-sm"
              >
                Cron-Schedule
              </Label>
              <Input
                id="cron-schedule"
                {...input}
                onChange={(e) =>
                  onChange({
                    schedule: e.target.value,
                    description: value?.description,
                  })
                }
                value={value?.schedule}
                placeholder="0 0 * * * *"
              />
            </div>
            <div className="space-y-0.5">
              <Label
                htmlFor="cron-description"
                className="pl-0.5 text-muted-foreground text-sm"
              >
                Description
              </Label>
              <Textarea
                id="cron-description"
                className="min-h-16"
                onChange={(e) =>
                  onChange({
                    schedule: value?.schedule,
                    description: e.target.value,
                  })
                }
                value={value?.description}
              />
            </div>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  )
}
