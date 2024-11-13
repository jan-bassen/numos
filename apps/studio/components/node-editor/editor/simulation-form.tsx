import { useHotkeys } from 'react-hotkeys-hook'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@repo/ui/components/ui/form'
import Link from 'next/link'
import GenericInput, {
  type GenericInputProps,
} from '@/components/datatypes/generic-input'
import { type Path, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { cn } from '@repo/ui/lib/utils'
import { useParams } from 'next/navigation'
import {
  getAttributeTypes,
  getDefaultValuesFromAttributes,
  getSchemaFromAttributes,
} from '@/components/elements/attributes/attribute-schema'
import {
  getDefaultValuesFromParameters,
  getParametersSchema,
  getParameterTypes,
} from '@/components/elements/actions/action-schema'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@repo/ui/components/ui/accordion'
import {
  PiAlertTriangleStroke,
  PiBarchartDefaultStroke,
  PiInformationCircleStroke,
  PiLinkChainHorizontalStroke,
  PiRefreshStroke,
  PiTagStroke,
} from '@repo/ui/icons/pika'
import { Alert, AlertDescription } from '@repo/ui/components/ui/alert'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@repo/ui/components/ui/dialog'
import { annotateMetadata, optionalMetadataSchema } from './metadata-schema'
import StringInput from '@/components/datatypes/inputs/string-input'
import { Button } from '@repo/ui/components/ui/button'
import NumberInput from '@/components/datatypes/inputs/number-input'
import { useEffect, useState } from 'react'
import ListFormInput from '@/components/datatypes/list-input-form'
import { toast } from 'sonner'
import type { ValueSettings, ValueType } from '@repo/engine/types/value-types'
import type { ActionTrigger } from '@/types/actions.types'
import type { SimulationData } from '@repo/engine/types/engine-types'
import { generateValueMap } from '@repo/engine/datatypes/utils'
import { useEditorContext } from './editor-provider'

export default function SimulationForm({
  id,
}: {
  id: string
}) {
  const { error, execute, editor } = useEditorContext()
  const action = editor?.editor.context.action
  const attributes = editor?.editor.context.attributes || []
  const [accordionOpen, setAccordionOpen] = useState<string[] | undefined>()
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

  const { collection } = useParams()
  if (!collection) throw new Error('Collection is not defined.')

  const trigger = action?.trigger as ActionTrigger | undefined
  const hasParams =
    action && trigger?.type === 'api' && trigger.settings.params.length > 0
  const parameters = hasParams ? trigger.settings.params : undefined

  const storedMetadata =
    typeof localStorage === 'undefined'
      ? {}
      : JSON.parse(localStorage?.getItem(`${collection}-metadata`) || '{}')

  const storedAttributeData =
    typeof localStorage === 'undefined'
      ? {}
      : JSON.parse(
          localStorage?.getItem(`${collection}-attribute-form`) || '{}',
        )

  const storedParamsData =
    typeof localStorage === 'undefined' || !hasParams
      ? {}
      : JSON.parse(
          localStorage?.getItem(`${collection}-${action.slug}-param-form`) ||
            '{}',
        )

  const defaultValues = {
    metadata: storedMetadata || {},
    attributes: getDefaultValuesFromAttributes(attributes, storedAttributeData),
    parameters: hasParams
      ? getDefaultValuesFromParameters(
          trigger.settings.params,
          storedParamsData,
        )
      : undefined,
  }

  const schema = z.object({
    metadata: optionalMetadataSchema,
    attributes: getSchemaFromAttributes(attributes, true),
    parameters: hasParams
      ? getParametersSchema(trigger.settings.params, true)
      : z.undefined(),
  })

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    defaultValues,
  })

  async function onSubmit(data: z.infer<typeof schema>) {
    localStorage.setItem(
      `${collection}-metadata`,
      JSON.stringify(data.metadata),
    )
    localStorage.setItem(
      `${collection}-attribute-form`,
      JSON.stringify(data.attributes),
    )
    if (hasParams) {
      localStorage.setItem(
        `${collection}-${action.slug}-param-form`,
        JSON.stringify(data.parameters),
      )
    }

    const annotatedMetadataValues = annotateMetadata(data.metadata)

    const attributeTypes = getAttributeTypes(attributes || [])
    const annotatedAttributeValues = generateValueMap(
      data.attributes,
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
        className={cn(
          'scrollbar-none h-full w-full space-y-2 overflow-y-scroll pt-7 pb-16 transition-all',
        )}
        id={id}
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
                <DialogTitle>Please set the inputs</DialogTitle>
                <DialogDescription>
                  Because there is no actual token during simulation,
                  you&apos;ll have to set some values manually.
                  <ul className="list-outside list-disc space-y-1 pt-3 pl-5 ">
                    <li>
                      <b>Metadata</b> is basic information about the token.
                    </li>
                    <li>
                      <b>Attributes</b> are the traits of the token. You can
                      define what these are on the attributes tab.
                    </li>
                    {hasParams && (
                      <li>
                        <b>Parameters</b> are the values that you would like to
                        pass to the action. You can define what these are in the
                        action settings.
                      </li>
                    )}
                  </ul>
                </DialogDescription>
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
                        <NumberInput datatype="number" {...field} />
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
                        <StringInput datatype="string" {...field} />
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
                        <StringInput datatype="string" {...field} />
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
                if (!attribute.token_specific) return null
                if (attribute.type === 'buffer') return null
                if (attribute.list) {
                  const itemKey = `attributes.${attribute.slug}` as Path<
                    z.infer<typeof schema>
                  >
                  const fieldValue = form.getValues(itemKey)
                  return (
                    <div
                      className={'flex w-full flex-col space-y-2'}
                      key={`attribute-${attribute.slug}`}
                    >
                      <div className="flex h-4 items-center justify-between gap-2 pr-1">
                        <FormLabel>
                          <Link
                            href={`/collections/${collection}/attributes/${attribute.slug}`}
                            className="py-1 hover:underline"
                          >
                            {attribute.name}
                          </Link>
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
                      <ListFormInput
                        inputProps={
                          {
                            datatype: attribute.type as ValueType,
                            settings: attribute.settings as ValueSettings,
                            placeholder: attribute.name || undefined,
                            locked: false,
                          } as GenericInputProps
                        }
                        form={form}
                        itemKey={`attributes.${attribute.slug}`}
                        defaultItemValue={{ value: undefined }}
                        classNames={{
                          container:
                            'min-h-12 grid-cols-1 md:grid-cols-1 xl:grid-cols-1 gap-2 bg-background p-2.5',
                          input: 'h-8 w-full',
                          item: 'h-8',
                          button: 'h-8',
                          handle: 'h-8',
                        }}
                        limitAxis="y"
                      />
                    </div>
                  )
                }
                return (
                  <FormField
                    control={form.control}
                    name={`attributes.${attribute.slug}`}
                    key={`attributes.${attribute.slug}`}
                    render={({ field }) => {
                      const props = {
                        datatype: attribute.type as ValueType,
                        settings: attribute.settings as ValueSettings,
                        placeholder: attribute.name || undefined,
                        locked: false,
                      } as GenericInputProps
                      return (
                        <FormItem>
                          <div
                            className={cn(
                              'flex w-full space-y-2',
                              attribute.type === 'boolean'
                                ? 'my-1 flex-row items-center justify-between'
                                : 'flex-col',
                            )}
                          >
                            <div className="flex h-4 items-center justify-between gap-2 pr-1">
                              <FormLabel>
                                <Link
                                  href={`/collections/${collection}/attributes/${attribute.slug}`}
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
                              <GenericInput {...props} {...field} />
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
                    if (parameter.list) {
                      const itemKey = `parameter.${parameter.key}` as Path<
                        z.infer<typeof schema>
                      >
                      const formItemId = `parameter.${itemKey}.0.value`
                      const fieldValue = form.getValues(itemKey)
                      return (
                        <div
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
                          <ListFormInput
                            inputProps={{
                              datatype: parameter.type as ValueType,
                              settings: undefined,
                              placeholder: parameter.key,
                              locked: false,
                            }}
                            form={form}
                            itemKey={`parameters.${parameter.key}`}
                            defaultItemValue={{ value: undefined }}
                            classNames={{
                              container:
                                'min-h-12 grid-cols-1 md:grid-cols-1 xl:grid-cols-1 gap-2 bg-background p-2.5',
                              input: 'h-8 w-full',
                              item: 'h-8',
                              button: 'h-8',
                              handle: 'h-8',
                            }}
                            limitAxis="y"
                          />
                        </div>
                      )
                    }
                    return (
                      <FormField
                        control={form.control}
                        name={`parameters.${parameter.key}`}
                        key={`parameters.${parameter.key}`}
                        render={({ field }) => {
                          const props = {
                            datatype: parameter.type as ValueType,
                            settings: undefined,
                            placeholder: parameter.key,
                            locked: false,
                          } as GenericInputProps
                          return (
                            <FormItem>
                              <div
                                className={cn(
                                  'flex w-full space-y-2',
                                  parameter.type === 'boolean'
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
                                  <GenericInput {...props} {...field} />
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
