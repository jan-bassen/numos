'use client'

import FormSegment from '@/components/forms/form-segment'
import { TabSelect } from '@/components/forms/tab-select'
import type {
  Action,
  TriggerType,
  DataType,
  UpdateAction,
  InsertAction,
  ReturnInfo,
  Version,
} from '@/types/database.types'
import { useEffect, useState } from 'react'
import {
  PiAddAddStroke,
  PiAutomationStroke,
  PiCrossCross,
  PiDeleteDustbin01Stroke,
} from '@/lib/icons'
import type { z } from 'zod'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  ManualFormMessage,
} from '@repo/ui/components/ui/form'
import { cn, handleReturnInfo, slugify } from '@/lib/utils'
import EditableHeader from '../../layout/pages/editable-header'
import { useRouter } from 'next/navigation'
import { Button, buttonVariants } from '@repo/ui/components/ui/button'
import DeleteDialogContent from '@repo/ui/components/dialogs/delete-dialog'
import { AlertDialogTrigger } from '@radix-ui/react-alert-dialog'
import { AlertDialog } from '@repo/ui/components/ui/alert-dialog'
import {
  type ActionTrigger,
  actionSchema,
  intervalUnitOptions,
  tokenEventOptions,
  triggerOptions,
} from './action-schema'
import {
  deleteAction,
  editAction,
  insertAction,
} from '@/lib/supabase/db/actions'
import Link from 'next/link'
import DatetimeInput from '@/components/datatypes/inputs/datetime-input'
import NumberInput from '@/components/datatypes/inputs/number-input'
import EnumInput from '@/components/datatypes/inputs/enum-input'
import { Input } from '@repo/ui/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/components/ui/select'
import { toast } from 'sonner'
import { dataTypes } from '@/lib/supabase/constants/datatypes'
import { listOptionMap, listOptions } from '../attributes/attribute-schema'
import { removeActionParameterFromLocalForm } from './utils'
import StringInput from '@/components/datatypes/inputs/string-input'
import CronInput from './cron-input'

export default function ActionEditor({
  action,
  collectionSlug,
  version,
}: {
  action: Action
  collectionSlug: string
  version: Version
}) {
  const trigger = action?.trigger as ActionTrigger
  const router = useRouter()
  const [locked, setLocked] = useState(!!action)
  const [type, setType] = useState(trigger?.type || 'api')

  const schema = actionSchema(type)

  const defaultValues = {
    name: action?.name || '',
    description: action?.description || undefined,
    trigger: trigger?.settings,
  }

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues,
    mode: 'onBlur',
  })

  useEffect(() => {
    if (!action) {
      form.setFocus('name')
    }
  }, [action, form.setFocus])

  const paramsArray = useFieldArray<z.infer<typeof schema>>({
    name: 'trigger.params',
    control: form.control,
  })

  async function onSubmit(data: z.infer<typeof schema>) {
    const oldSlug = action?.slug
    const slug = slugify(data.name || '')
    let res: ReturnInfo
    if (action) {
      const newAction: UpdateAction = {
        id: action.id,
        name: data.name,
        slug,
        description: data.description || null,
        trigger: { type, settings: data.trigger } as ActionTrigger,
      }

      res = await editAction(newAction)
    } else {
      const newAction: InsertAction = {
        name: data.name,
        slug,
        version: version.id,
        description: data.description || null,
        trigger: { type, settings: data.trigger } as ActionTrigger,
      }
      res = await insertAction(newAction)
    }
    handleReturnInfo(
      res,
      () => {
        if (oldSlug !== slug)
          router.push(`/studio/${collectionSlug}/actions/${slug}`)
        setLocked(true)
      },
      () => {},
    )
  }

  function onError(errors: unknown) {
    if (errors instanceof Error) {
      toast.error(`Error with inputs: ${errors.message}`)
      return
    }
  }

  function onReset() {
    if (!action) {
      router.push(`/studio/${collectionSlug}/actions`)
    }
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, onError)}
          className="space-y-8 pb-6 lg:space-y-10"
        >
          <EditableHeader
            form={form}
            defaultValues={defaultValues}
            locked={locked}
            setLocked={setLocked}
            onReset={onReset}
            title={action ? action?.name || 'Unnamed Attribute' : undefined}
            titlePlaceholder="New Action"
            subtitle={action?.description || ''}
          >
            {locked && action && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant={'outline'} className="gap-1.5">
                    <PiDeleteDustbin01Stroke className="size-4" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <DeleteDialogContent
                  title="attribute"
                  onDelete={() => {
                    deleteAction(action.id, collectionSlug)
                  }}
                />
              </AlertDialog>
            )}
          </EditableHeader>
          <div className="w-full space-y-8">
            {action && (
              <FormSegment
                title="Execution Logic"
                description="Define what the action does when triggered."
              >
                <Link
                  href={`/studio/${collectionSlug}/actions/${action.slug}/logic`}
                  className={cn(
                    buttonVariants({ variant: 'outline' }),
                    'relative flex min-h-28 w-fulitems-center max-w-[35rem] justify-center gap-2 overflow-hidden',
                  )}
                >
                  <PiAutomationStroke className="my-auto size-4" />
                  Edit Logic
                  <div className="!bg-dots_grid absolute size-full translate-x-[12.5px] translate-y-[15px] bg-[50px_50px] bg-[length:100px_100px] opacity-25" />
                </Link>
              </FormSegment>
            )}
            <FormSegment
              title="Trigger"
              description="Define how the action gets triggered and starts executing."
              options={[
                {
                  label: 'API',
                  explanation:
                    'Trigger via an API call from your app, website or other service',
                },
                {
                  label: 'Interval',
                  explanation:
                    'Trigger automatically at a set interval, e.g. every 3 days',
                },
                {
                  label: 'Schedule',
                  explanation:
                    'Trigger automatically at a schedule, e.g. every first day of the month at 10am',
                },
                {
                  label: 'Token',
                  explanation:
                    'Trigger automatically when a token event occurs, e.g. when a token is minted',
                },
              ]}
            >
              <EnumInput
                datatype="enum"
                value={type}
                onChange={(v) => setType(v as TriggerType)}
                locked={locked}
                staticoptions={triggerOptions}
                className="w-full md:max-w-[35rem]"
              />
            </FormSegment>
            {type === 'interval' && (
              <FormSegment
                title="Interval Settings"
                description="Define the details of the interval trigger."
              >
                <div className="flex md:max-w-[35rem] gap-4">
                  <FormField
                    control={form.control}
                    name="trigger.start"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Start</FormLabel>
                        <FormControl>
                          <DatetimeInput
                            {...field}
                            datatype="datetime"
                            locked={locked}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />{' '}
                  <FormField
                    control={form.control}
                    name="trigger.end"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>End</FormLabel>
                        <FormControl>
                          <DatetimeInput
                            {...field}
                            datatype="datetime"
                            locked={locked}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex w-full -xs:flex-col gap-4 md:max-w-[35rem]">
                  <FormField
                    control={form.control}
                    name="trigger.interval"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Interval (every...)</FormLabel>
                        <FormControl>
                          <NumberInput
                            {...field}
                            datatype="number"
                            locked={locked}
                            className="w-full"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="trigger.unit"
                    render={({ field }) => (
                      <FormItem className="w-full xs:w-36">
                        <FormLabel>Unit</FormLabel>
                        <FormControl>
                          <EnumInput
                            {...field}
                            datatype="enum"
                            staticoptions={intervalUnitOptions}
                            locked={locked}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </FormSegment>
            )}
            {type === 'schedule' && (
              <FormSegment
                title="Schedule"
                description="Define the schedule that triggers the action. The format is a cron expression. For more information, see the AWS documentation."
                link={{
                  label: 'Learn more',
                  href: 'https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-scheduled-rule-pattern.html#eb-cron-expressions',
                }}
                className="w-full md:max-w-[35rem]"
              >
                <div className="flex w-full gap-4 md:max-w-[35rem]">
                  <FormField
                    control={form.control}
                    name="trigger.start"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Start</FormLabel>
                        <FormControl>
                          <DatetimeInput
                            {...field}
                            datatype="datetime"
                            locked={locked}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />{' '}
                  <FormField
                    control={form.control}
                    name="trigger.end"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>End</FormLabel>
                        <FormControl>
                          <DatetimeInput
                            {...field}
                            datatype="datetime"
                            locked={locked}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="trigger.schedule"
                  render={({ field }) => {
                    const state = form.getFieldState('trigger.schedule')
                    return (
                      <FormItem className="w-full">
                        <FormLabel>Definition</FormLabel>
                        <FormControl>
                          <CronInput
                            button={{
                              variant: 'outline',
                              size: 'form',
                              disabled: locked,
                            }}
                            input={{ disabled: locked }}
                            field={field}
                            state={state}
                            validate={() => form.trigger('trigger.schedule')}
                          />
                        </FormControl>
                        {
                          //@ts-ignore
                          state.error?.schedule?.message && (
                            <FormMessage className="w-full">
                              {
                                //@ts-ignore
                                state.error?.schedule?.message
                              }
                            </FormMessage>
                          )
                        }
                      </FormItem>
                    )
                  }}
                />
              </FormSegment>
            )}
            {type === 'token' && (
              <FormSegment
                title="Token Event"
                description="Define the token event that triggers the action."
              >
                <FormField
                  control={form.control}
                  name="trigger.event"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event</FormLabel>
                      <FormControl>
                        <EnumInput
                          {...field}
                          datatype="enum"
                          staticoptions={tokenEventOptions}
                          locked={locked}
                          className="w-fit md:w-[35rem]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </FormSegment>
            )}
            {type === 'api' && (
              <FormSegment
                title="Parameters"
                description="Define input parameters for the API call."
                className="w-full"
              >
                {paramsArray.fields.map((field, index) => (
                  <div key={field.id} className="flex w-full flex-col gap-2">
                    <FormLabel>{`Parameter ${index + 1}`}</FormLabel>
                    <div className="flex w-full gap-2">
                      <FormField
                        control={form.control}
                        name={`trigger.params.${index}.type`}
                        render={({ field }) => (
                          <FormItem>
                            <Select
                              onValueChange={(v) => {
                                field.onChange(v)
                                const param = paramsArray.fields[index]?.key
                                if (param) {
                                  removeActionParameterFromLocalForm(
                                    collectionSlug,
                                    action.slug,
                                    param,
                                  )
                                }
                              }}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger disabled={locked}>
                                  <SelectValue {...field}>
                                    {dataTypes[
                                      field.value as DataType
                                    ].icons.stroke({
                                      className: 'h-4 w-4 mr-1.5',
                                    })}
                                  </SelectValue>
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="min-w-44 overflow-visible">
                                {Object.entries(dataTypes).map(([key, def]) => {
                                  if (!def.parameter) return null
                                  return (
                                    <SelectItem
                                      className="hover:bg-muted"
                                      key={key}
                                      value={key}
                                    >
                                      <div className="flex flex-row items-center gap-2">
                                        {dataTypes[
                                          key as DataType
                                        ].icons.stroke({
                                          className: 'h-4 w-4',
                                        })}
                                        {dataTypes[key as DataType].title}
                                      </div>
                                    </SelectItem>
                                  )
                                })}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`trigger.params.${index}.list`}
                        render={({ field }) => (
                          <FormItem>
                            <Select
                              onValueChange={(v) => {
                                field.onChange(v === 'list')
                                const param = paramsArray.fields[index]?.key
                                if (param) {
                                  removeActionParameterFromLocalForm(
                                    collectionSlug,
                                    action.slug,
                                    param,
                                  )
                                }
                              }}
                              defaultValue={field.value ? 'list' : 'single'}
                            >
                              <FormControl>
                                <SelectTrigger disabled={locked}>
                                  <SelectValue {...field}>
                                    {listOptionMap[
                                      field.value ? 'list' : 'single'
                                    ].Icon({
                                      className: 'h-4 w-4 mr-1.5',
                                    })}
                                  </SelectValue>
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="min-w-44 overflow-visible">
                                {listOptions.map((option) => {
                                  return (
                                    <SelectItem
                                      className=" hover:bg-muted"
                                      key={option.slug}
                                      value={option.slug as string}
                                    >
                                      <div className="flex flex-row items-center gap-2">
                                        {option.Icon({
                                          className: 'h-4 w-4 ',
                                        })}
                                        {option.label}
                                      </div>
                                    </SelectItem>
                                  )
                                })}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`trigger.params.${index}.key`}
                        render={({ field }) => (
                          <FormItem className="w-full max-w-[30rem]">
                            <FormControl>
                              <Input
                                {...field}
                                disabled={locked}
                                className="w-full"
                                onBlur={() => {
                                  form.trigger('trigger.params')
                                  field.onBlur()
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {!locked && (
                        <Button
                          variant={'outline'}
                          size={'icon'}
                          className="shrink-0"
                          onClick={() => {
                            paramsArray.remove(index)
                            const param = paramsArray.fields[index]?.key
                            if (param) {
                              removeActionParameterFromLocalForm(
                                collectionSlug,
                                action.slug,
                                param,
                              )
                            }
                          }}
                        >
                          <PiCrossCross className="size-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                <FormField
                  control={form.control}
                  name={'trigger.params'}
                  render={() => <FormMessage />}
                />
                {!locked && (
                  <Button
                    type="button"
                    variant={'ghost'}
                    onClick={() =>
                      paramsArray.append({
                        key: '',
                        list: false,
                        type: 'string',
                      })
                    }
                    className="w-fit gap-1.5 pl-2"
                  >
                    <PiAddAddStroke className="size-4" />
                    Add Parameter
                  </Button>
                )}
              </FormSegment>
            )}
          </div>
        </form>
      </Form>
    </>
  )
}
