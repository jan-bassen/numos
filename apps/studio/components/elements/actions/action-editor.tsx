'use client'

import FormSegment from '@/components/forms/form-segment'
import type {
  Action,
  TriggerType,
  DataType,
  UpdateAction,
  InsertAction,
  ReturnInfo,
  Version,
} from '@/types/database.types'
import { useState } from 'react'
import {
  PiAddAddStroke,
  PiAutomationStroke,
  PiCrossCross,
} from '@repo/ui/icons/pika'
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
} from '@repo/ui/components/ui/form'
import { cn, handleReturnInfo } from '@repo/ui/lib/utils'
import { useRouter } from 'next/navigation'
import { Button, buttonVariants } from '@repo/ui/components/ui/button'
import {
  actionSchema,
  intervalUnitOptions,
  tokenEventOptions,
  triggerOptions,
} from './action-schema'
import {
  deleteAction,
  editAction,
  insertAction,
  setActionLock,
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
import CronInput from './cron-input'
import slugify from 'slugify'
import type { ActionTrigger } from '@/types/actions.types'
import Main from '@/components/layout/pages/new-main'
import Header from '@/components/layout/pages/new-header'
import FormContent from '@/components/forms/form-content'
import LockButton from '@/components/buttons/lock-button'
import ResetButton from '@/components/buttons/reset-button'
import DeleteButton from '@/components/buttons/delete-button'
import SaveButton from '@/components/buttons/save-button'
import { Textarea } from '@repo/ui/components/ui/textarea'

export default function ActionEditor({
  action,
  collectionSlug,
  version,
}: {
  action: Action
  collectionSlug: string
  version: Version
}) {
  const trigger = action?.trigger
  const router = useRouter()
  const [locked, setLocked] = useState(action.locked)
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
          router.push(`/collections/${collectionSlug}/actions/${slug}`)
        form.reset(defaultValues)
      },
      () => {},
    )
  }

  function onReset() {
    form.reset(defaultValues)
  }

  function onError(errors: unknown) {
    if (errors instanceof Error) {
      toast.error(`Error with inputs: ${errors.message}`)
      return
    }
  }

  return (
    <>
      <Header
        title={action.name || 'Unnamed Attribute'}
        subtitle={action.description || ''}
      >
        <DeleteButton
          title="action"
          onDelete={() => {
            deleteAction(action.id, collectionSlug)
          }}
        />
        {form.formState.isDirty ? (
          <>
            <ResetButton onClick={() => onReset()} />
            <SaveButton type="submit" form="action-form" />
          </>
        ) : (
          <LockButton
            element="action"
            id={action.id}
            locked={locked}
            setLocked={setLocked}
          />
        )}
      </Header>
      <Main>
        <Form {...form}>
          <form
            id="action-form"
            onSubmit={form.handleSubmit(onSubmit, onError)}
            className="space-y-8 pb-6 lg:space-y-10"
          >
            <FormContent>
              <FormSegment
                title="Information"
                description="Change the basic information of the action."
                options={[
                  {
                    label: 'Name',
                    explanation:
                      'The name will show up throughout the studio and wherever your action is displayed. You can change it later.',
                  },
                  {
                    label: 'Description',
                    explanation:
                      'A description will help you and others remember what your action is about. This will also show up in marketplaces and other places.',
                  },
                ]}
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} className="w-full max-w-[35rem]" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} className="w-full max-w-[35rem]" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </FormSegment>
              {action && (
                <FormSegment
                  title="Execution Logic"
                  description="Define what the action does when triggered."
                >
                  <Link
                    href={`/collections/${collectionSlug}/actions/${action.slug}/logic`}
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
                options={triggerOptions.map(({ label, description }) => ({
                  label,
                  explanation: description || '',
                }))}
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
                  <div className="flex gap-4 md:max-w-[35rem]">
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
                                  {Object.entries(dataTypes).map(
                                    ([key, def]) => {
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
                                    },
                                  )}
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
            </FormContent>
          </form>
        </Form>
      </Main>
    </>
  )
}
