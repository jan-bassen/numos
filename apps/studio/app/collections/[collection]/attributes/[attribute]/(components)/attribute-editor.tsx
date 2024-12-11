'use client'

import Segment from '@/components/layouts/segmented/segment'
import { TabSelect } from '@/components/forms/tab-inputs/tab-select'
import type {
  Attribute,
  Version,
  UpdateAttribute,
} from '@/types/database.types'
import { useEffect, useState } from 'react'
import {
  PiAddAddStroke,
  PiCrossCross,
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
import { deleteAttribute, updateAttribute } from '@/lib/supabase/db/attributes'
import { handleReturnInfo } from '@repo/ui/lib/utils'
import { useRouter } from 'next/navigation'
import { attributeSchema, displayOptions } from '@/lib/schemas/attribute-schema'
import { Button } from '@repo/ui/components/ui/button'
import { Input } from '@repo/ui/components/ui/input'
import { ListFormInput } from '@/components/datatypes/list/list-input-form'
import { removeAttributeFromLocalForm } from '../../(functions)/utils'
import { slugify } from '@/lib/utils'
import type {
  Value,
  ValueSettings,
  ValueType,
} from '@repo/engine/types/value-types'
import { NumberInput } from '@/components/datatypes/number/number-input'
import {
  Header,
  HeaderActions,
  HeaderContent,
  HeaderMain,
} from '@/components/page/header'
import Main from '@/components/page/main'
import SegmentedLayout from '@/components/layouts/segmented/segmented-layout'
import LockButton from '@/components/forms/buttons/lock-button-legacy'
import SaveButton from '@/components/forms/buttons/save-button'
import ResetButton from '@/components/forms/buttons/reset-button'
import DeleteButton from '@/components/forms/buttons/delete-button'
import { Page } from '@/components/page/page'
import { isArray } from 'lodash'
import {
  getDataTypeInput,
  type SingleDataTypeInputProps,
} from '@/components/datatypes/single-datatype-input'
function getDefaultValuesFromAttribute(
  attribute: Attribute,
  updatedAttribute?: UpdateAttribute,
) {
  return {
    name: updatedAttribute?.name || attribute.name || '',
    badge: updatedAttribute?.type || attribute.type,
    list: updatedAttribute?.list || attribute.list || false,
    description:
      updatedAttribute?.description || attribute.description || undefined,
    display: updatedAttribute?.display || attribute.display || 'public',
    settings:
      updatedAttribute?.settings || (attribute.settings as ValueSettings) || {},
  }
}

export default function AttributeEditor({
  attribute,
  collectionSlug,
  version,
}: {
  attribute: Attribute
  collectionSlug: string
  version: Version
}) {
  console.log('locked', attribute.locked)
  const router = useRouter()
  const [locked, setLocked] = useState(attribute.locked)
  const { type, list } = attribute

  const schema = attributeSchema(type, list)

  const defaultValues = getDefaultValuesFromAttribute(attribute)

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

    const newAttribute: UpdateAttribute = {
      id: attribute.id,
      name: data.name,
      slug,
      version: version.id,
      description: data.description || null,
      type: attribute.type,
      list: attribute.list,
      token_specific: true,
      display: data.display,
      settings: data.settings as ValueSettings,
    }
    const res = await updateAttribute(newAttribute, oldSlug)

    handleReturnInfo(
      res,
      () => {
        if (slug !== oldSlug)
          router.push(`/collections/${collectionSlug}/attributes/${slug}`)
        form.reset(getDefaultValuesFromAttribute(attribute, newAttribute))
      },
      () => {},
    )
  }

  function onError(errors: any) {
    console.log(form.getValues())
    console.log(errors)
  }

  function onReset() {
    form.reset(defaultValues)
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
    <Page>
      <Header>
        <HeaderContent>
          <HeaderMain>
            {/* <HeaderTitle>{attribute.name || attribute.slug}</HeaderTitle>
            <HeaderBadge>{`${list ? 'List of ' : ''}${dataTypes[type].title}${list ? 's' : ''}`}</HeaderBadge> */}
          </HeaderMain>
          <HeaderActions>
            <DeleteButton
              title="attribute"
              onDelete={async () => {
                const res = await deleteAttribute(
                  attribute.id,
                  attribute.version,
                  attribute.slug,
                )
                handleReturnInfo(res, () => {
                  removeAttributeFromLocalForm(collectionSlug, attribute.slug)
                  router.push(`/collections/${collectionSlug}/attributes`)
                })
              }}
            />
            {form.formState.isDirty ? (
              <>
                <ResetButton onClick={() => onReset()} />
                <SaveButton type="submit" form="attribute-form" />
              </>
            ) : (
              <LockButton
                element="attribute"
                id={attribute.id}
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
            id="attribute-form"
            onSubmit={form.handleSubmit(onSubmit, onError)}
            className="space-y-8 pb-8 lg:space-y-10"
          >
            <SegmentedLayout>
              {/* <Segment
                title="Information"
                description="Change the basic information of the attribute."
                options={[
                  {
                    label: 'Name',
                    explanation:
                      'The name will show up throughout the studio and wherever your attribute is displayed. You can change it later.',
                  },
                  {
                    label: 'Description',
                    explanation:
                      'A description will help you and others remember what your attribute is about. This will also show up in marketplaces and other places.',
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
              </Segment> */}
              <Segment
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
                          disabled={locked}
                          options={displayOptions}
                          className="w-full max-w-form-input"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Segment>
              {type === 'enum' && (
                <Segment
                  title="Options"
                  description="Define possible options for the attribute can be set to."
                  className="w-full"
                >
                  {optionsArray.fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="flex w-full max-w-form-input justify-start gap-2"
                    >
                      <FormField
                        control={form.control}
                        name={`settings.options.${index}.value`}
                        render={({ field }) => {
                          const { value, ...rest } = field
                          return (
                            <FormItem className="w-full">
                              <Input
                                disabled={locked}
                                className="w-full"
                                {...rest}
                                value={value || ''}
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
                </Segment>
              )}
              <Segment
                title="Default Value"
                description="If a default value is set, this value won't have to be provided on mint."
                className="flex flex-col gap-6"
              >
                {list ? (
                  <ListFormInput
                    form={form}
                    itemKey="settings.default"
                    inputProps={{
                      type: type as ValueType,
                      settings: getSettings(),
                      locked: locked,
                    }}
                    classNames={{ container: 'w-full  max-w-form-input' }}
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
                      const DataTypeInput = getDataTypeInput<
                        typeof attribute.type
                      >(attribute.type)
                      const props: SingleDataTypeInputProps<
                        typeof attribute.type
                      > = {
                        type: attribute.type,
                        settings: getSettings(),
                        locked: locked,
                        placeholder: 'No default value',
                        value: {
                          type: attribute.type,
                          format: 'single',
                          value: field.value,
                        } as Value<typeof attribute.type, 'single', true>,
                        onChange: (v) => {
                          field.onChange(v.value)
                        },
                      }
                      return (
                        <FormItem>
                          <FormControl>
                            <div className="flex w-full max-w-form-input gap-2">
                              <DataTypeInput {...props} />
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
              </Segment>
              {type === 'number' && (
                <Segment
                  title="Range"
                  description="If set, the attribute can only be within the boundaries."
                >
                  <div className="flex w-full max-w-form-input flex-col gap-3 lg:flex-row">
                    <FormField
                      control={form.control}
                      name="settings.min"
                      render={({ field }) => {
                        return (
                          <FormItem className="w-full">
                            <FormLabel>Min</FormLabel>
                            <FormControl>
                              <NumberInput
                                type="number"
                                locked={locked}
                                placeholder="No lower limit"
                                className="w-full"
                                value={{
                                  type: 'number',
                                  format: 'single',
                                  value: field.value,
                                }}
                                onChange={(v) => {
                                  field.onChange(v.value)
                                }}
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
                              <NumberInput
                                type="number"
                                value={{
                                  type: 'number',
                                  format: 'single',
                                  value: field.value,
                                }}
                                onChange={(v) => {
                                  field.onChange(v.value)
                                }}
                                locked={locked}
                                className="w-full"
                                placeholder="No upper limit"
                                onBlur={field.onBlur}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )
                      }}
                    />
                  </div>
                </Segment>
              )}
            </SegmentedLayout>
          </form>
        </Form>
      </Main>
    </Page>
  )
}
