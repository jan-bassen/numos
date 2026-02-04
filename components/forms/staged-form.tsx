import { Button } from '@repo/ui/components/button'
import type {
  ControllerRenderProps,
  FieldPath,
  FieldValues,
  Path,
  UseFormReturn,
} from 'react-hook-form'
import { useEffect, useRef, useState, type JSX } from 'react'
import { cn } from '@repo/ui/lib/utils'
import { Form, FormField } from '@repo/ui/components/form'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from '@repo/ui/components/pagination'
import { ChevronLeft, ChevronRight, type LucideIcon } from 'lucide-react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@repo/ui/components/carousel'
import { isEmpty } from 'lodash'

export type StaticStageDefinition<
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  Schema extends FieldValues,
  Key extends FieldPath<Schema> = FieldPath<Schema>,
> = {
  key: Key
  title: string
  description: string
  icon: LucideIcon
  field: (field: ControllerRenderProps<Schema, Key>) => JSX.Element
}

export type StageDefinition<
  Schema extends FieldValues,
  Key extends FieldPath<Schema> = FieldPath<Schema>,
> = (form: UseFormReturn<Schema>) => StaticStageDefinition<Schema, Key>

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function StagedForm<Schema extends Record<string, any>>({
  form,
  stages,
  onSubmit,
  onError,
}: {
  form: UseFormReturn<Schema>
  stages: StaticStageDefinition<Schema>[]
  onSubmit: (values: Schema) => void
  onError: (errors: unknown) => void
}) {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)

  const submitButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!api) {
      return
    }

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  const stage = stages[current]

  const hasPreviousStage = api?.canScrollPrev()
  const hasNextStage = api?.canScrollNext()

  function goToNextStage() {
    api?.scrollNext()
    if (!stage) return
    setTimeout(() => form.trigger(stage.key as Path<Schema>), 100)
  }

  function goToPreviousStage() {
    if (hasPreviousStage) {
      api?.scrollPrev()
      if (!stage) return
      setTimeout(() => form.trigger(stage.key as Path<Schema>), 100)
    }
  }

  function goToSpecificStage(index: number) {
    api?.scrollTo(index)
    if (!stage) return
    setTimeout(() => form.trigger(stage.key as Path<Schema>), 100)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit(onSubmit, onError)
        }}
        id="basicAttributeForm"
        className="flex flex-col justify-between gap-8"
      >
        <Carousel
          enableKeyboardControls={false}
          setApi={setApi}
          opts={{
            duration: 15,
            watchDrag: false,
            loop: false,
          }}
        >
          <CarouselContent className="w-[32rem] pb-4">
            {stages.map((s, i) => {
              return (
                <CarouselItem key={s.key as string} className="">
                  <div className="space-y-8 px-6">
                    <div className="space-y-1.5">
                      <h1 className="font-bold text-xl">{s.title}</h1>
                      <p className="line-clamp-2 h-10 text-ellipsis text-muted-foreground text-sm">
                        {s.description}
                      </p>
                    </div>
                    <FormField
                      key={s.key as Path<Schema>}
                      control={form.control}
                      name={s.key as Path<Schema>}
                      render={({ field }) => s.field(field)}
                    />
                  </div>
                </CarouselItem>
              )
            })}
          </CarouselContent>
        </Carousel>
        <div className="flex w-full justify-between px-6 pt-4">
          <Button
            variant={'ghost'}
            type="button"
            className={cn('gap-1 pl-2.5', !hasPreviousStage && '!opacity-0')}
            disabled={!hasPreviousStage}
            onClick={() => goToPreviousStage()}
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Previous</span>
          </Button>
          <Pagination>
            <PaginationContent>
              {stages.map((s, i) => {
                const Icon = s.icon
                return (
                  <PaginationItem key={s.key as Path<Schema>}>
                    <Button
                      type="button"
                      size={'icon'}
                      variant={i === current ? 'outline' : 'ghost'}
                      onClick={() => goToSpecificStage(i)}
                      className={cn(
                        form.getFieldState(s.key as Path<Schema>).invalid &&
                          'text-destructive',
                      )}
                    >
                      <Icon className="size-4" />
                    </Button>
                  </PaginationItem>
                )
              })}
            </PaginationContent>
          </Pagination>
          {hasNextStage ? (
            <Button
              key="next"
              className="gap-1 pr-2.5"
              type="button"
              disabled={!hasNextStage}
              onClick={() => {
                goToNextStage()
              }}
            >
              <span>Next</span>
              <ChevronRight className="size-4" />
            </Button>
          ) : (
            <Button
              ref={submitButtonRef}
              onClick={() => {
                form.handleSubmit(onSubmit, onError)()
              }}
              key="submit"
              type="submit"
              form="basicAttributeForm"
              disabled={hasNextStage || !isEmpty(form.formState.errors)}
              className="focus-visible:outline-3 focus-visible:outline-ring focus-visible:outline-offset-2"
            >
              Create
            </Button>
          )}
        </div>
      </form>
    </Form>
  )
}
