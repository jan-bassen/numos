'use client'

import FormSegment from '@/components/forms/form-segment'
import { TabSelect } from '@/components/forms/tab-select'
import { TabToggle } from '@/components/forms/tab-toggle'
import {
  type Attribute,
  type DataType,
  type ValueDataType,
  type ReturnInfo,
  type InsertAttribute,
  UpdateAttribute,
  type Version,
} from '@/types/database.types'
import { useEffect, useState } from 'react'
import type { BadgeVariant } from '@repo/ui/components/ui/badge'
import {
  PiAddAddStroke,
  PiCrossCross,
  PiDeleteDustbin01Stroke,
  PiRefreshStroke,
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
import GenericInput from '@/components/datatypes/generic-input'
import {
  deleteAttribute,
  insertAttribute,
  updateAttribute,
} from '@/lib/supabase/db/attributes'
import { handleReturnInfo } from '@repo/ui/lib/utils'
import EditableHeader from '../../layout/pages/editable-header'
import { useRouter } from 'next/navigation'
import {
  attributeSchema,
  displayOptions,
  scopeOptions,
} from './attribute-schema'
import { Button } from '@repo/ui/components/ui/button'
import DeleteDialogContent from '@repo/ui/components/dialogs/delete-dialog'
import {
  AlertDialogTrigger,
  AlertDialog,
} from '@repo/ui/components/ui/alert-dialog'
import { Input } from '@repo/ui/components/ui/input'
import { toast } from 'sonner'
import { dataTypes } from '@/lib/supabase/constants/datatypes'
import ListInput from '@/components/datatypes/list-input'
import { isArray } from 'lodash'
import ListFormInput from '@/components/datatypes/list-input-form'
import { removeAttributeFromLocalForm } from './utils'
import { slugify } from '@/lib/utils'
import type { ValueSettings } from '@repo/engine/src/types/value-types'

export default function AttributeEditor({
  attribute,
  collectionSlug,
  version,
}: {
  attribute?: Attribute
  collectionSlug: string
  version: Version
}) {
  const router = useRouter()
  const [locked, setLocked] = useState(!!attribute)
  /* const [type, setType] = useState<DataType>(attribute?.type || "enum"); */
  const { type, list } = attribute || {
    type: 'enum' as ValueDataType,
    list: false,
  }

  const badge = type
    ? {
        text: `${list ? 'List of ' : ''}${dataTypes[type].title}${list ? 's' : ''}`,
        variant: 'secondary' as BadgeVariant,

        /* options: Object.entries(dataTypes)
          .map(([key, value]) => {
            if (!value.attribute) return;
            return {
              value: key,
              label: value.title,
            };
          })
          .filter((o) => o !== undefined) as { value: string; label: string }[],
        onChange: (v: string) => {
          form.setValue("settings.default", null);
          setType(v as DataType);
        }, */
      }
    : undefined

  const schema = attributeSchema(type, list)

  const defaultValues = {
    name: attribute?.name || '',
    badge: type,
    list: attribute?.list || false,
    description: attribute?.description || undefined,
    token_specific: attribute?.token_specific || true,
    display: attribute?.display || 'public',
    settings: (attribute?.settings as ValueSettings) || {},
  }

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues,
    mode: 'onBlur',
  })

  useEffect(() => {
    if (!attribute) {
      form.setFocus('name')
    }
  }, [attribute, form])

  const optionsArray = useFieldArray({
    name: 'settings.options',
    control: form.control,
  })

  async function onSubmit(data: z.infer<typeof schema>) {
    const oldSlug = attribute?.slug
    const slug = slugify(data.name)
    let res: ReturnInfo
    if (attribute) {
      const newAttribute = {
        id: attribute.id,
        name: data.name,
        slug,
        version: version.id,
        description: data.description || null,
        type: data.badge as DataType,
        list: attribute.list,
        token_specific: data.token_specific,
        display: data.display,
        settings: data.settings as ValueSettings,
      }
      res = await updateAttribute(newAttribute, oldSlug)
    } else {
      const newAttribute: InsertAttribute = {
        name: data.name,
        slug,
        version: version.id,
        description: data.description || null,
        type: data.badge as DataType,
        token_specific: data.token_specific,
        display: data.display,
        settings: data.settings as ValueSettings,
      }
      res = await insertAttribute(newAttribute)
    }
    handleReturnInfo(
      res,
      () => {
        if (slug !== oldSlug)
          router.push(`/studio/${collectionSlug}/attributes/${slug}`)
        setLocked(true)
      },
      () => {},
    )
  }

  function onError(errors: any) {
    console.log(form.getValues())
    console.log(errors)
  }

  function onReset() {
    if (!attribute) {
      router.push(`/studio/${collectionSlug}/attributes`)
    }
    /* setType(attribute?.type || "enum"); */
    form.resetField('settings')
    if (list) {
      form.setValue('settings.default', attribute?.settings?.default || [])
    }
  }

  function getSettings() {
    if (type === 'enum') {
      const optionValues = form.getValues().settings?.options as {
        value: string
      }[]
      return {
        ...form.getValues().settings,
        options: optionValues?.map((option) => {
          return { value: option.value, label: option.value }
        }),
      }
    }
    return form.getValues().settings as ValueSettings
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onError)}
        className="space-y-8 pb-8 lg:space-y-10"
      >
        <EditableHeader
          form={form}
          defaultValues={defaultValues}
          locked={locked}
          setLocked={setLocked}
          onReset={onReset}
          title={attribute?.name || undefined}
          titlePlaceholder="Name"
          subtitle={attribute?.description || undefined}
          subtitlePlaceholder="Description"
          badge={badge}
        >
          {locked && attribute && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant={'outline'} className="gap-1.5">
                  <PiDeleteDustbin01Stroke className="size-4" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <DeleteDialogContent
                title="attribute"
                onDelete={async () => {
                  const res = await deleteAttribute(
                    attribute.id,
                    collectionSlug,
                    attribute.version,
                    attribute.slug,
                  )
                  handleReturnInfo(res, () => {
                    removeAttributeFromLocalForm(collectionSlug, attribute.slug)
                    router.push(`/studio/${collectionSlug}/attributes`)
                  })
                }}
              />
            </AlertDialog>
          )}
        </EditableHeader>
        <div className="w-full space-y-8">
          <FormSegment
            title="Scope"
            description="A collection-wide attribute can be changed, but is applied to every token. Usually you want to use token-specific attributes."
          >
            <FormField
              control={form.control}
              name="token_specific"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <TabToggle
                      {...field}
                      locked={locked}
                      options={scopeOptions}
                      className="w-full max-w-[30rem]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormSegment>
          <FormSegment
            title="Display"
            description="Only private attributes are secret and not added to the metadata. Shadowed attributes are still public, but not necessarily visible on frontends."
          >
            <FormField
              control={form.control}
              name="display"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <TabSelect
                      {...field}
                      locked={locked}
                      options={displayOptions}
                      className="w-full max-w-[30rem]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormSegment>
          {type === 'enum' && (
            <FormSegment
              title="Options"
              description="Define possible options for the attribute can be set to."
              className="w-full"
            >
              {optionsArray.fields.map((field, index) => (
                <div key={field.id} className="flex w-full justify-start gap-2">
                  <FormField
                    control={form.control}
                    name={`settings.options.${index}.value`}
                    render={({ field }) => {
                      return (
                        <FormItem className="w-full max-w-[30rem]">
                          <Input
                            disabled={locked}
                            className="w-full"
                            {...field}
                            onBlur={(e) => {
                              form.trigger('settings.options')
                              // @ts-ignore
                              field.onBlur(e)
                            }}
                          />
                          <FormMessage />
                        </FormItem>
                      )
                    }}
                  />
                  {!locked && (
                    <Button
                      variant={'outline'}
                      size={'icon'}
                      className="shrink-0"
                      onClick={() => {
                        optionsArray.remove(index)
                        form.trigger('settings.options')
                      }}
                    >
                      <PiCrossCross className="size-4" />
                    </Button>
                  )}
                </div>
              ))}
              {!locked && (
                <Button
                  type="button"
                  variant={'ghost'}
                  onClick={() => {
                    optionsArray.append({ key: '', type: 'string' })
                  }}
                  className="w-fit gap-1.5 pl-2"
                >
                  <PiAddAddStroke className="size-4" />
                  Add Option
                </Button>
              )}
              <FormField
                control={form.control}
                name="settings.options"
                render={() => <FormMessage />}
              />
            </FormSegment>
          )}
          <FormSegment
            title="Default Value"
            description="If a default value is set, this value won't have to be provided on mint."
            className="flex flex-col gap-6"
          >
            {list && type !== 'exec' ? (
              <ListFormInput
                form={form}
                itemKey="settings.default"
                datatype={type}
                settings={getSettings()}
                locked={locked}
                classNames={{ container: 'w-full' }}
                defaultValue={
                  isArray(defaultValues.settings?.default)
                    ? defaultValues.settings.default
                    : defaultValues.settings.default !== undefined &&
                        defaultValues.settings.default !== null
                      ? [defaultValues.settings.default]
                      : []
                }
                defaultItemValue={{ value: undefined }}
              />
            ) : (
              <FormField
                control={form.control}
                name="settings.default"
                render={({ field }) => {
                  const { ref, ...rest } = field
                  return (
                    <FormItem>
                      <FormLabel>Default Value</FormLabel>
                      <FormControl>
                        <div className="flex gap-2">
                          <GenericInput
                            environment="form"
                            datatype={type as ValueDataType}
                            locked={locked}
                            settings={getSettings()}
                            className="w-[30rem]"
                            placeholder="No default value"
                            {...rest}
                          />
                          {(!!form.getValues().settings.default ||
                            form.getValues().settings.default === false) &&
                            !locked && (
                              <Button
                                variant="outline"
                                type="button"
                                size="icon"
                                onClick={() => {
                                  form.setValue('settings.default', null, {
                                    shouldDirty: true,
                                    shouldTouch: true,
                                  })
                                }}
                              >
                                <PiRefreshStroke className="size-4" />
                              </Button>
                            )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />
            )}
          </FormSegment>
          {type === 'number' && (
            <FormSegment
              title="Range"
              description="If set, the attribute can only be within the boundaries."
            >
              <div className="flex w-full max-w-[30rem] flex-col gap-3 lg:flex-row">
                <FormField
                  control={form.control}
                  name="settings.min"
                  render={({ field }) => {
                    const { ref, ...rest } = field
                    return (
                      <FormItem className="w-full">
                        <FormLabel>Min</FormLabel>
                        <FormControl>
                          <GenericInput
                            datatype={type}
                            locked={locked}
                            placeholder="No lower limit"
                            className="w-full"
                            {...rest}
                            onBlur={(e) => {
                              form.trigger('settings.max')
                              // @ts-ignore
                              field.onBlur(e)
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )
                  }}
                />
                <FormField
                  control={form.control}
                  name="settings.max"
                  render={({ field }) => {
                    const { ref, ...rest } = field
                    return (
                      <FormItem className="w-full">
                        <FormLabel>Max</FormLabel>
                        <FormControl>
                          <GenericInput
                            datatype={type}
                            locked={locked}
                            className="w-full"
                            placeholder="No upper limit"
                            {...rest}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )
                  }}
                />
              </div>
            </FormSegment>
          )}
        </div>
      </form>
    </Form>
  )
}
