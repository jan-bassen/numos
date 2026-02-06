import { Alert, AlertDescription } from '@repo/ui/components/alert'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@repo/ui/components/dialog'
import { toast } from 'sonner'
import {
  PiAlertTriangleStroke,
  PiBarchartDefaultStroke,
  PiInformationCircleStroke,
  PiLinkChainHorizontalStroke,
  PiRefreshStroke,
  PiTagStroke,
} from '@repo/ui/icons/pika'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@repo/ui/components/form'
import Link from 'next/link'
import { type Path, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { cn } from '@repo/ui/lib/utils'
import { getAttributeTypes } from '@/components/node-editor/run-sidebar/simulation-form/get-attributes'
import { getParameterTypes } from '@/components/node-editor/run-sidebar/simulation-form/get-parameters'
import { getSchemaFromParameters } from '@/lib/schemas/actions/get-schema-from-parameters'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@repo/ui/components/accordion'
import { useHotkeys } from 'react-hotkeys-hook'
import {
  annotateMetadata,
  optionalMetadataSchema,
} from '@/lib/schemas/metadata-schema'
import { StringInput } from '@/components/datatypes/string/string-input'
import { Button } from '@repo/ui/components/button'
import { NumberInput } from '@/components/datatypes/number/number-input'
import { useEffect, useState } from 'react'

import type { Value } from '@repo/shared/types/values'
import type { ActionTrigger } from '@/lib/schemas/actions/action-schema'
import type { SimulationData } from '@repo/shared/types/engine-types'
import { generateValueMap } from '@repo/shared/schemas/datatypes/utils'
import { useEditorContext } from '@/components/node-editor/editor/editor-provider'
import {
  getDataTypeInput,
  type SingleDataTypeInputProps,
} from '@/components/datatypes/single-datatype-input'
import { getSchemaFromAttributes } from '@/lib/schemas/attributes/get-schema-from-attributes'
import DatatypeListInput from '@/components/datatypes/list/datatype-list-input'
import { storeLocalData, useLocalData } from './use-local-data'
import type { Parameter } from '@/lib/schemas/actions/triggers/api'
import { useCollection } from '@/app/collections/[collection]/collection-context'

export function SimulationForm({
  id,
}: {
  id: string
}) {
  const { error, execute, editor } = useEditorContext()
  const action = editor?.editor.context.action
  const attributes = editor?.editor.context.attributes || []
  const [accordionOpen, setAccordionOpen] = useState<string[] | undefined>()
  const {
    collection: { id: collectionId, slug: collectionSlug },
  } = useCollection()

  if (!collectionId) throw new Error('Collection is not defined.')

  useEffect(() => {
    if (error?.location?.input) {
      const type = error.location.input.type
      const key = error.location.input.key
      setAccordionOpen([type])
      form.setError(
        // @ts-ignore
        `${type}.${key}`,
        {
          type: 'custom',
          message: 'This value is used, so it needs to be defined',
        },
        {
          shouldFocus: true,
        },
      )
    }
    if (!error || !error.location.input) form.trigger()
  }, [error])

  const trigger = action?.trigger as ActionTrigger | undefined

  const hasParams =
    action && trigger?.type === 'api' && trigger.settings.params.length > 0

  const parameters = hasParams
    ? (trigger?.settings.params as Parameter[])
    : undefined

  const schema = z.object({
    metadata: optionalMetadataSchema,
    attributes: getSchemaFromAttributes(attributes, true),
    parameters:
      parameters && parameters.length > 0
        ? getSchemaFromParameters(parameters, true)
        : z.undefined().optional(),
  })

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
  })

  useLocalData({
    collectionId,
    actionId: action?.id,
    attributes,
    parameters,
    form,
  })

  async function onSubmit(data: z.infer<typeof schema>) {
    storeLocalData({
      data,
      collectionId,
      actionId: action?.id,
    })

    const annotatedMetadataValues = annotateMetadata(data.metadata)

    const attributeTypes = getAttributeTypes(attributes || [])
    const annotatedAttributeValues = generateValueMap(
      data?.attributes || {},
      attributeTypes,
    )

    const parameterTypes = getParameterTypes(parameters || [])

    const annotatedParameterValues = data.parameters
      ? generateValueMap(data.parameters, parameterTypes)
      : {}

    //TODO: Mayge validate all entries here?!?!
    const simulationData: SimulationData = {
      basicMetadata: annotatedMetadataValues,
      attributes: annotatedAttributeValues,
      parameters: annotatedParameterValues,
    }

    execute(simulationData)
  }

  function onError(errors: unknown) {
    if (errors instanceof Error) {
      toast.error(`Error with inputs: ${errors.message}`)
      return
    }
  }

  useHotkeys('shift+space', (e) => {
    form.handleSubmit(onSubmit, onError)()
  })

  const metadataError = form.formState.errors.metadata
  const attrError = form.formState.errors.attributes
  const paramError = form.formState.errors.parameters

  const defaultOpen: string[] = []
  if (metadataError) defaultOpen.push('metadata')
  if (attrError) defaultOpen.push('attributes')
  if (paramError) defaultOpen.push('parameters')

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onError)}
        className="scrollbar-none h-full w-full space-y-2 overflow-y-scroll pt-7 pb-16 transition-all"
        id={id}
        data-hs-cf-bound="true"
      >
        {attrError || paramError || metadataError ? (
          <div className="px-4 py-2">
            <Alert className="" variant="destructive">
              <PiAlertTriangleStroke className="size-3.5" />
              <AlertDescription className="">
                There seems to be an error with the inputs. Please check the
                inputs below and try again.
              </AlertDescription>
            </Alert>
          </div>
        ) : (
          <Dialog>
            <DialogTrigger className="flex w-full items-center justify-center gap-1.5 py-1.5 pr-5 pl-4 text-muted-foreground text-sm hover:text-foreground">
              <PiInformationCircleStroke className="size-3.5" />
              What do I define here?
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Please set your test token</DialogTitle>
                <DialogDescription>
                  Because there is no actual token during simulation,
                  you&apos;ll have to define it&apos;s state manually.
                </DialogDescription>
                <ul className="list-outside list-disc space-y-1 pt-2 pl-5 text-muted-foreground text-sm">
                  <li>
                    <b className="font-semibold text-foreground">Metadata</b> is
                    basic information about the token.
                  </li>
                  <li>
                    <b className="font-semibold text-foreground">Attributes</b>{' '}
                    are the traits of the token. You can define what these are
                    on the attributes tab.
                  </li>
                  {
                    /* hasParams */ false && (
                      <li>
                        <b className="font-semibold text-foreground">
                          Parameters
                        </b>{' '}
                        are the values that you pass to the action&apos;s if
                        called with an api trigger. You can define what these
                        are in the action settings.
                      </li>
                    )
                  }
                </ul>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        )}
        <Accordion
          type="multiple"
          defaultValue={defaultOpen}
          value={accordionOpen}
          onValueChange={setAccordionOpen}
          className="space-y-3"
        >
          <AccordionItem value="metadata" className="border-b-0">
            <AccordionTrigger className="border-b px-4 py-2 ">
              <div
                className={cn(
                  'flex items-center gap-1.5 text-sm',
                  metadataError && 'text-destructive',
                )}
              >
                <PiTagStroke className="size-3.5" />
                Metadata
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 border-b bg-muted/20 p-3 pt-5 pb-7">
              <FormField
                control={form.control}
                name={'metadata.id'}
                key={'metadata.id'}
                render={({ field }) => (
                  <FormItem>
                    <div className={cn('flex w-full flex-col space-y-2')}>
                      <div className="flex h-4 items-center justify-between pr-1">
                        <FormLabel>Id</FormLabel>
                        {!!field.value && (
                          <Button
                            variant={'ghost'}
                            size={'iconXs'}
                            className="text-border-highlight"
                            onClick={() => {
                              form.setValue('metadata.id', null, {
                                shouldDirty: true,
                                shouldTouch: true,
                              })
                            }}
                          >
                            <PiRefreshStroke className="size-3.5" />
                          </Button>
                        )}
                      </div>
                      <FormControl>
                        <NumberInput
                          environment="simulation"
                          type="number"
                          value={{
                            type: 'number',
                            format: 'single',
                            value: field.value,
                          }}
                          onChange={(v) => {
                            field.onChange(v.value)
                          }}
                          onBlur={field.onBlur}
                        />
                      </FormControl>
                    </div>
                    <FormMessage className="w-full" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={'metadata.name'}
                key={'metadata.name'}
                render={({ field }) => (
                  <FormItem>
                    <div className={cn('flex w-full flex-col space-y-2')}>
                      <div className="flex h-4 items-center justify-between pr-1">
                        <FormLabel>Name</FormLabel>
                        {!!field.value && (
                          <Button
                            variant={'ghost'}
                            size={'iconXs'}
                            className="text-border-highlight"
                            onClick={() => {
                              form.setValue('metadata.name', null, {
                                shouldDirty: true,
                                shouldTouch: true,
                              })
                            }}
                          >
                            <PiRefreshStroke className="size-3.5" />
                          </Button>
                        )}
                      </div>
                      <FormControl>
                        <StringInput
                          environment="simulation"
                          type="string"
                          value={{
                            type: 'string',
                            format: 'single',
                            value: field.value,
                          }}
                          onChange={(v) => {
                            field.onChange(v.value)
                          }}
                          onBlur={field.onBlur}
                        />
                      </FormControl>
                    </div>
                    <FormMessage className="w-full" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={'metadata.description'}
                key={'metadata.description'}
                render={({ field }) => (
                  <FormItem>
                    <div className={cn('flex w-full flex-col space-y-2')}>
                      <div className="flex h-4 items-center justify-between pr-1">
                        <FormLabel>Description</FormLabel>
                        {!!field.value && (
                          <Button
                            variant={'ghost'}
                            size={'iconXs'}
                            className="text-border-highlight"
                            onClick={() => {
                              form.setValue('metadata.description', null, {
                                shouldDirty: true,
                                shouldTouch: true,
                              })
                            }}
                          >
                            <PiRefreshStroke className="size-3.5" />
                          </Button>
                        )}
                      </div>
                      <FormControl>
                        <StringInput
                          environment="simulation"
                          type="string"
                          value={{
                            type: 'string',
                            format: 'single',
                            value: field.value,
                          }}
                          onChange={(v) => {
                            field.onChange(v.value)
                          }}
                          onBlur={field.onBlur}
                        />
                      </FormControl>
                    </div>
                    <FormMessage className="w-full" />
                  </FormItem>
                )}
              />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="attributes" className="border-b-0">
            <AccordionTrigger className="border-b px-4 py-2 ">
              <div
                className={cn(
                  'flex items-center gap-1.5 text-sm',
                  attrError && 'text-destructive',
                )}
              >
                <PiBarchartDefaultStroke className="size-3.5" />
                Attributes
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 border-b bg-muted/20 p-3 pt-5 pb-7">
              {attributes.map((attribute) => {
                if (!attribute.tokenSpecific) return null
                if (!attribute.value) return null
                const attrValue = attribute.value // Capture for TypeScript narrowing
                if (attrValue.type === 'buffer') return null
                if (attrValue.list) {
                  const itemKey = `attributes.${attribute.id}` as Path<
                    z.infer<typeof schema>
                  >
                  const fieldValue = form.getValues(itemKey)
                  return (
                    <FormField
                      control={form.control}
                      name={`attributes.${attribute.id}`}
                      key={`attributes.${attribute.id}`}
                      render={({ field }) => (
                        <div
                          className={'flex w-full flex-col space-y-2'}
                          key={`attribute-${attribute.id}`}
                        >
                          <div className="flex h-4 items-center justify-between gap-2 pr-1">
                            <FormLabel>
                              <Link
                                href={`/collections/${collectionSlug}/attributes/${attribute.slug}`}
                                className="py-1 hover:underline"
                              >
                                {attribute.name}
                              </Link>
                            </FormLabel>
                            {(!!fieldValue || fieldValue === false) && (
                              <Button
                                variant={'ghost'}
                                size={'icon'}
                                type="button"
                                className="text-border-highlight"
                                onClick={() => {
                                  form.setValue(itemKey, [], {
                                    shouldDirty: true,
                                    shouldTouch: true,
                                  })
                                }}
                              >
                                <PiRefreshStroke className="size-3.5" />
                              </Button>
                            )}
                          </div>
                          <FormControl>
                            <DatatypeListInput
                              environment="simulation"
                              type={attrValue.type}
                              restrictions={attrValue.restrictions}
                              locked={false}
                              value={{
                                type: attrValue.type,
                                format: 'objectarray',
                                value: Array.isArray(field.value)
                                  ? field.value
                                  : [],
                              }}
                              onChange={(v) => {
                                field.onChange(v.value)
                              }}
                            />
                          </FormControl>
                        </div>
                      )}
                    />
                  )
                }
                return (
                  <FormField
                    control={form.control}
                    name={`attributes.${attribute.id}`}
                    key={`attributes.${attribute.id}`}
                    render={({ field }) => {
                      const DataTypeInput = getDataTypeInput<
                        typeof attrValue.type | 'buffer'
                      >(attrValue.type)
                      const props: SingleDataTypeInputProps<
                        typeof attrValue.type | 'buffer'
                      > = {
                        type: attrValue.type,
                        restrictions: attrValue.restrictions,
                        placeholder: attribute.name || undefined,
                        locked: false,
                        value: {
                          type: attrValue.type,
                          format: 'single',
                          value: field.value,
                        } as Value<typeof attrValue.type, 'single', true>,
                        onChange: (v) => {
                          field.onChange(v.value)
                        },
                        environment: 'simulation',
                        id: `attribute-${attribute.id}`,
                      }
                      return (
                        <FormItem>
                          <div
                            className={cn(
                              'flex w-full space-y-2',
                              attrValue.type === 'boolean'
                                ? 'my-1 flex-row items-center justify-between'
                                : 'flex-col',
                            )}
                          >
                            <div className="flex h-4 items-center justify-between gap-2 pr-1">
                              <FormLabel>
                                <Link
                                  href={`/collections/${collectionSlug}/attributes/${attribute.slug}`}
                                  className="py-1 hover:underline"
                                >
                                  {attribute.name}
                                </Link>
                              </FormLabel>
                              {(!!field.value || field.value === false) && (
                                <Button
                                  variant={'ghost'}
                                  size={'iconXs'}
                                  className="text-border-highlight"
                                  onClick={() => {
                                    form.setValue(field.name, null, {
                                      shouldDirty: true,
                                      shouldTouch: true,
                                    })
                                  }}
                                >
                                  <PiRefreshStroke className="size-3.5" />
                                </Button>
                              )}
                            </div>
                            <FormControl>
                              <DataTypeInput environment="form" {...props} />
                            </FormControl>
                          </div>
                          <FormMessage className="w-full" />
                        </FormItem>
                      )
                    }}
                  />
                )
              })}
            </AccordionContent>
          </AccordionItem>
          {hasParams && (
            <AccordionItem value="parameters" className="border-b-0">
              <AccordionTrigger className="border-b px-4 py-2 ">
                <div
                  className={cn(
                    'flex items-center gap-1.5 text-sm',
                    paramError && 'text-destructive',
                  )}
                >
                  <PiLinkChainHorizontalStroke className="size-3.5" />
                  Parameters
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 border-b bg-muted/20 p-3 pt-5 pb-7">
                {hasParams &&
                  trigger?.settings.params.map((parameter) => {
                    if (parameter.value.list) {
                      const itemKey = `parameter.${parameter.key}` as Path<
                        z.infer<typeof schema>
                      >
                      const fieldValue = form.getValues(itemKey)
                      return (
                        <FormField
                          control={form.control}
                          name={`parameters.${parameter.key}`}
                          key={`parameters.${parameter.key}`}
                          render={({ field }) => (
                            <FormItem
                              className={'flex w-full flex-col space-y-2'}
                              key={`parameter-${parameter.key}`}
                            >
                              <div className="flex h-4 items-center justify-between gap-2 pr-1">
                                <FormLabel>
                                  <h3 className="py-1 capitalize">
                                    {parameter.key}
                                  </h3>
                                </FormLabel>
                                {(!!fieldValue || fieldValue === false) && (
                                  <Button
                                    variant={'ghost'}
                                    size={'iconXs'}
                                    type="button"
                                    className="text-border-highlight"
                                    onClick={() => {
                                      form.setValue(itemKey, [], {
                                        shouldDirty: true,
                                        shouldTouch: true,
                                      })
                                    }}
                                  >
                                    <PiRefreshStroke className="size-3.5" />
                                  </Button>
                                )}
                              </div>
                              <DatatypeListInput
                                environment="simulation"
                                type={parameter.value.type}
                                restrictions={parameter.value.restrictions}
                                locked={false}
                                value={{
                                  type: parameter.value.type,
                                  format: 'objectarray',
                                  value: Array.isArray(field.value)
                                    ? field.value
                                    : [],
                                }}
                                onChange={(v) => {
                                  field.onChange(v.value)
                                }}
                              />
                            </FormItem>
                          )}
                        />
                      )
                    }

                    return (
                      <FormField
                        control={form.control}
                        name={`parameters.${parameter.key}`}
                        key={`parameters.${parameter.key}`}
                        render={({ field }) => {
                          const DataTypeInput = getDataTypeInput<
                            typeof parameter.value.type
                          >(parameter.value.type)
                          const props: SingleDataTypeInputProps<
                            typeof parameter.value.type
                          > = {
                            type: parameter.value.type,
                            restrictions: undefined,
                            placeholder: parameter.key,
                            locked: false,
                            value: {
                              type: parameter.value.type,
                              format: 'single',
                              value: field.value,
                            } as Value<
                              typeof parameter.value.type,
                              'single',
                              true
                            >,
                            onChange: (v) => {
                              field.onChange(v.value)
                            },
                            environment: 'form',
                            id: `parameter-${parameter.key}`,
                          }
                          return (
                            <FormItem>
                              <div
                                className={cn(
                                  'flex w-full space-y-2',
                                  parameter.value.type === 'boolean'
                                    ? 'my-1 flex-row items-center justify-between'
                                    : 'flex-col',
                                )}
                              >
                                <div className="flex h-4 items-center justify-between gap-2 pr-1">
                                  <FormLabel>{parameter.key}</FormLabel>
                                  {(!!field.value || field.value === false) && (
                                    <Button
                                      variant={'ghost'}
                                      size={'iconXs'}
                                      className=" text-border-highlight"
                                      onClick={() => {
                                        form.setValue(field.name, null, {
                                          shouldDirty: true,
                                          shouldTouch: true,
                                        })
                                      }}
                                    >
                                      <PiRefreshStroke className="size-3.5" />
                                    </Button>
                                  )}
                                </div>
                                <FormControl>
                                  <DataTypeInput
                                    environment="simulation"
                                    {...props}
                                  />
                                </FormControl>
                              </div>
                              <FormMessage className="w-full" />
                            </FormItem>
                          )
                        }}
                      />
                    )
                  })}
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      </form>
    </Form>
  )
}
