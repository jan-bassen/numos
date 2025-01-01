'use client'

import Segment from '@/components/layouts/segmented/segment'
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
import { actionSchema } from '@/lib/schemas/action-schema'
import {
  deleteAction,
  editAction,
  insertAction,
  setActionLock,
} from '@/lib/supabase/db/actions'
import Link from 'next/link'
import { DatetimeInput } from '@/components/datatypes/datetime/datetime-input'
import { NumberInput } from '@/components/datatypes/number/number-input'
import { EnumInput } from '@/components/datatypes/enum/enum-input'
import { Input } from '@repo/ui/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/components/ui/select'
import { toast } from 'sonner'
import { dataTypes } from '@/lib/constants/datatypes'
import { listOptionMap, listOptions } from '@/lib/constants/list-options'
import { removeActionParameterFromLocalForm } from '@/app/collections/[collection]/actions/(functions)/utils'
import CronInput from './cron-input'
import slugify from 'slugify'
import type { ActionTrigger } from '@/types/actions.types'
import Main from '@/components/page/main'
import {
  Header,
  HeaderActions,
  HeaderContent,
  HeaderMain,
  HeaderTitle,
} from '@/components/page/header'
import SegmentedLayout from '@/components/layouts/segmented/segmented-layout'
import ResetButton from '@/components/forms/buttons/reset-button'
import DeleteButton from '@/components/forms/buttons/delete-button'
import SaveButton from '@/components/forms/buttons/save-button'
import { Textarea } from '@repo/ui/components/ui/textarea'
import { Page } from '@/components/page/page'
import {
  intervalUnitOptions,
  tokenEventOptions,
  triggerOptionsArray,
} from '@/lib/constants/triggers'

function getDefaultValuesFromAction(
  action: Action,
  updatedAction?: UpdateAction,
) {
  return {
    name: updatedAction?.name || action.name || '',
    description: updatedAction?.description || action.description || undefined,
    trigger: updatedAction?.trigger?.settings || action.trigger?.settings,
  }
}

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

  const defaultValues = getDefaultValuesFromAction(action)

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

    const newAction: UpdateAction = {
      id: action.id,
      name: data.name,
      slug,
      description: data.description || null,
      trigger: { type, settings: data.trigger } as ActionTrigger,
    }

    const res = await editAction(newAction)

    handleReturnInfo(
      res,
      () => {
        if (oldSlug !== slug)
          router.push(`/collections/${collectionSlug}/actions/${slug}`)
        form.reset(getDefaultValuesFromAction(action, newAction))
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
    <Page>
      <Header>
        <HeaderContent>
          <HeaderMain>
            <HeaderTitle>{action.name || 'Unnamed Attribute'}</HeaderTitle>
          </HeaderMain>
          <HeaderActions>
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
          </HeaderActions>
        </HeaderContent>
      </Header>
      <Main>
        <Form {...form}>
          <form
            id="action-form"
            onSubmit={form.handleSubmit(onSubmit, onError)}
            className="space-y-8 pb-6 lg:space-y-10"
          >
            <SegmentedLayout>
              <Segment
                title="Information"
                info={{
                  description: 'Change the basic information of the action.',

                  options: [
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
                  ],
                }}
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={locked}
                          className="w-full max-w-form-input"
                        />
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
                        <Textarea
                          {...field}
                          disabled={locked}
                          className="w-full max-w-form-input"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Segment>
              {action && (
                <Segment
                  title="Execution Logic"
                  description="Define what the action does when triggered."
                >
                  <Link
                    href={`/collections/${collectionSlug}/actions/${action.slug}/logic`}
                    className={cn(
                      buttonVariants({ variant: 'outline' }),
                      'relative flex min-h-28 w-fulitems-center max-w-form-input justify-center gap-2 overflow-hidden',
                    )}
                  >
                    <PiAutomationStroke className="my-auto size-4" />
                    Edit Logic
                    <div className="!bg-dots_grid absolute size-full translate-x-[12.5px] translate-y-[15px] bg-[50px_50px] bg-[length:100px_100px] opacity-25" />
                  </Link>
                </Segment>
              )}
              <Segment
                title="Trigger"
                description="Define how the action gets triggered and starts executing."
                options={triggerOptionsArray.map(({ label, description }) => ({
                  label,
                  explanation: description || '',
                }))}
              >
                <EnumInput
                  type="enum"
                  value={{ type: 'enum', format: 'single', value: type }}
                  onChange={(v) => setType(v.value as TriggerType)}
                  locked={locked}
                  settings={{
                    options: triggerOptionsArray,
                  }}
                  className="w-full md:max-w-form-input"
                />
              </Segment>
              {type === 'interval' && (
                <Segment
                  title="Interval Settings"
                  description="Define the details of the interval trigger."
                >
                  <div className="flex gap-4 md:max-w-form-input">
                    <FormField
                      control={form.control}
                      name="trigger.start"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Start</FormLabel>
                          <FormControl>
                            <DatetimeInput
                              value={{
                                type: 'datetime',
                                format: 'single',
                                value: field.value,
                              }}
                              onChange={(v) => {
                                field.onChange(v.value)
                              }}
                              type="datetime"
                              locked={locked}
                              onBlur={field.onBlur}
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
                              value={{
                                type: 'datetime',
                                format: 'single',
                                value: field.value,
                              }}
                              onChange={(v) => {
                                field.onChange(v.value)
                              }}
                              type="datetime"
                              locked={locked}
                              onBlur={field.onBlur}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex w-full -xs:flex-col gap-4 md:max-w-form-input">
                    <FormField
                      control={form.control}
                      name="trigger.interval"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Interval (every...)</FormLabel>
                          <FormControl>
                            <NumberInput
                              value={{
                                type: 'number',
                                format: 'single',
                                value: field.value,
                              }}
                              onChange={(v) => {
                                field.onChange(v.value)
                              }}
                              type="number"
                              locked={locked}
                              className="w-full"
                              onBlur={field.onBlur}
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
                              value={{
                                type: 'enum',
                                format: 'single',
                                value: field.value,
                              }}
                              onChange={(v) => {
                                field.onChange(v.value)
                              }}
                              type="enum"
                              settings={{
                                options: intervalUnitOptions,
                              }}
                              locked={locked}
                              onBlur={field.onBlur}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </Segment>
              )}
              {type === 'schedule' && (
                <Segment
                  title="Schedule"
                  description="Define the schedule that triggers the action. The format is a cron expression. For more information, see the AWS documentation."
                  link={{
                    label: 'Learn more',
                    href: 'https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-scheduled-rule-pattern.html#eb-cron-expressions',
                  }}
                  className="w-full md:max-w-form-input"
                >
                  <div className="flex w-full gap-4">
                    <FormField
                      control={form.control}
                      name="trigger.start"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Start</FormLabel>
                          <FormControl>
                            <DatetimeInput
                              value={{
                                type: 'datetime',
                                format: 'single',
                                value: field.value,
                              }}
                              onChange={(v) => {
                                field.onChange(v.value)
                              }}
                              type="datetime"
                              locked={locked}
                              onBlur={field.onBlur}
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
                              value={{
                                type: 'datetime',
                                format: 'single',
                                value: field.value,
                              }}
                              onChange={(v) => {
                                field.onChange(v.value)
                              }}
                              type="datetime"
                              locked={locked}
                              onBlur={field.onBlur}
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
                </Segment>
              )}
              {type === 'token' && (
                <Segment
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
                            value={{
                              type: 'enum',
                              format: 'single',
                              value: field.value,
                            }}
                            onChange={(v) => {
                              field.onChange(v.value)
                            }}
                            type="enum"
                            settings={{
                              options: tokenEventOptions,
                            }}
                            locked={locked}
                            className="w-fit md:max-w-form-input"
                            onBlur={field.onBlur}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </Segment>
              )}
              {type === 'api' && (
                <Segment
                  title="Parameters"
                  description="Define input parameters for the API call."
                  className="w-full"
                >
                  {paramsArray.fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="flex w-full max-w-form-input flex-col gap-2"
                    >
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
                </Segment>
              )}
            </SegmentedLayout>
          </form>
        </Form>
      </Main>
    </Page>
  )
}
