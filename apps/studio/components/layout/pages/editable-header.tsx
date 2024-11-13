import NavBreadcrumbs from '@/components/nav/nav-breadcrumbs'
import { Badge, type BadgeVariant } from '@repo/ui/components/ui/badge'
import { cn } from '@repo/ui/lib/utils'
import { type ReactNode, useEffect, useRef, useState } from 'react'
import { Input } from '@repo/ui/components/ui/input'
import type { ControllerRenderProps, UseFormReturn } from 'react-hook-form'
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@repo/ui/components/ui/form'
import { Textarea } from '@repo/ui/components/ui/textarea'
import SelectableBadge from '../../forms/selectable-badge'
import { Button } from '@repo/ui/components/ui/button'
import {
  PiCheckTickSquareBrokenStroke,
  PiCrossCrossSquare,
  PiPencilEditSolid,
  PiPencilEditStroke,
} from '@repo/ui/icons/pika'
import Header from './new-header'
import Link from 'next/link'
import { useMediaQuery } from '@/lib/hooks/media-query'
import { SupabaseImage } from '@/lib/supabase/storage/supabaseImage'
import {
  type StorageLocation,
  uploadFile,
} from '@/lib/supabase/storage/uploaders'
import type { ReturnInfo } from '@/types/database.types'

export function EditableHeaderImage({
  location,
  updateFunction,
  alt,
  size,
  locked = false,
  initial,
  className,
}: {
  location: StorageLocation
  alt: string
  size: number
  locked: boolean
  updateFunction?: (fullPath: string) => Promise<ReturnInfo>
  initial?: string
  className?: string
}) {
  const [image, setImage] = useState<string | undefined>(initial)
  const imageInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setImage(initial)
  }, [initial])

  return (
    <div className="size-fit p-0">
      <input
        type="file"
        accept="image/*"
        id="image-input"
        ref={imageInputRef}
        className="hidden"
        onChange={async (event) => {
          const file = event.target.files?.[0]
          if (!file) return
          const newImage = await uploadFile(
            location,
            file,
            updateFunction,
            image,
          )
          if (newImage) setImage(newImage)
        }}
      />
      <button
        type="button"
        onClick={() => imageInputRef.current?.click()}
        className="group grid place-items-center"
        /* disabled={locked} */
      >
        <>
          {/* {!locked && ( */}
          <PiPencilEditSolid className="z-10 col-span-1 col-start-1 row-span-1 row-start-1 size-6 text-white opacity-0 transition-opacity group-hover:opacity-100" />
          {/* )} */}
          <SupabaseImage
            src={image ? `${location.bucket}/${image}` : undefined}
            alt={alt}
            width={size}
            height={size}
            className={cn(
              `col-span-1 aspect-square object-cover col-start-1 row-span-1 row-start-1 size-[${
                size * 2
              }px] rounded-md`,
              className,
            )}
          />
        </>
      </button>
    </div>
  )
}

export function EditableHeading({
  field,
  placeholder,
  isMediumScreen,
}: {
  field: ControllerRenderProps<any, 'name'>
  isMediumScreen: boolean
  placeholder?: string
}) {
  return (
    <FormItem>
      <FormControl>
        <Input
          {...field}
          placeholder={placeholder}
          className="!h-11 !text-4xl min-h-0 shrink border-border/50 px-1 py-1 font-bold"
          style={{
            minWidth: '12ch',
            maxWidth: '24ch',
            width: !isMediumScreen
              ? '100%'
              : field.value?.length
                ? `${field.value.length + 1}ch`
                : '4ch',
          }}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )
}

export function EditableDescription({
  field,
  placeholder,
}: {
  field: ControllerRenderProps<any, 'description'>
  placeholder?: string
}) {
  return (
    <FormItem className="w-full grow">
      <FormControl>
        <Textarea
          {...field}
          placeholder={placeholder}
          className={cn(
            'line-clamp-1 w-full max-w-[40rem] text-balance border-border/50 px-1 py-0.5 font-normal text-muted-foreground text-sm',
            field.value?.length > 0 ? '!min-h-12 h-12' : '!min-h-7 h-7',
          )}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )
}

export function EditableBadge({
  field,
  options,
  variant,
  onChange,
}: {
  field: ControllerRenderProps<any, 'badge'>
  options: { value: string; label: string }[]
  variant?: BadgeVariant
  onChange?: (value: string) => void
}) {
  return (
    <FormItem>
      <FormControl>
        <SelectableBadge
          value={field.value}
          options={options}
          onValueChange={(v) => {
            onChange?.(v)
            field.onChange(v)
          }}
          variant={variant}
          className="-md:px-3.5 -md:py-1.5 -md:text-sm"
        >
          {options.find((option) => option.value === field.value)?.label}
        </SelectableBadge>
      </FormControl>
      <FormMessage />
    </FormItem>
  )
}

// TODO: Add types and change fixed field names
export default function EditableHeader({
  form,
  defaultValues,
  locked,
  setLocked,
  onReset,
  title,
  titlePlaceholder,
  subtitle,
  subtitlePlaceholder,
  badge,
  icon,
  children,
  className,
  showBreadcrumbs = true,
}: {
  form: UseFormReturn<any>
  defaultValues: any
  locked: boolean
  setLocked: (locked: boolean) => void
  onReset?: () => void
  title?: string
  titlePlaceholder?: string
  subtitle?: string
  subtitlePlaceholder?: string
  badge?: {
    text: string
    link?: string
    variant?: BadgeVariant
    onChange?: (value: string) => void
    options?: { value: string; label: string }[]
  }
  icon?: ReactNode
  children?: ReactNode
  className?: string
  showBreadcrumbs?: boolean
}) {
  const isMediumScreen = useMediaQuery('(min-width: 768px)')
  if (locked) {
    return (
      <Header
        title={title || titlePlaceholder || 'Unnamed Page'}
        subtitle={subtitle}
        badge={badge}
        icon={icon}
        className={className}
        showBreadcrumbs={showBreadcrumbs}
      >
        {children}
        <Button className="gap-2" onClick={() => setLocked(false)}>
          <PiPencilEditStroke className="h-4 w-4" />
          Edit
        </Button>
      </Header>
    )
  }
  return (
    <header
      className={cn(
        'flex w-full flex-col gap-6 lg:flex-col xl:gap-2',
        !showBreadcrumbs && 'pt-6',
        className,
      )}
    >
      <div className={cn('hidden', showBreadcrumbs && 'md:block')}>
        <NavBreadcrumbs />
      </div>
      <div className="flex w-full flex-col justify-between gap-4 lg:flex-row lg:gap-2">
        <div className="flex w-full min-w-[60%] grow flex-col gap-1.5">
          {badge && !isMediumScreen && (locked || !!badge?.onChange) ? (
            badge.options ? (
              <FormField
                control={form.control}
                name="badge"
                render={({ field }) => (
                  <EditableBadge
                    field={field}
                    variant={badge?.variant}
                    options={badge.options || []}
                    onChange={badge.onChange}
                  />
                )}
              />
            ) : badge?.link ? (
              <Link href={badge.link}>
                <Badge variant={badge?.variant} className="mt-1">
                  {badge?.text}
                </Badge>
              </Link>
            ) : (
              <Badge variant={badge?.variant} className="mt-1">
                {badge?.text}
              </Badge>
            )
          ) : null}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              {icon && (
                <div className="aspect-square h-full shrink-0">{icon}</div>
              )}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <EditableHeading
                    field={field}
                    isMediumScreen={isMediumScreen}
                    placeholder={titlePlaceholder}
                  />
                )}
              />
            </div>
            {badge && isMediumScreen && (locked || !!badge?.onChange) ? (
              badge.options ? (
                <FormField
                  control={form.control}
                  name="badge"
                  render={({ field }) => (
                    <EditableBadge
                      field={field}
                      variant={badge?.variant}
                      options={badge.options || []}
                      onChange={badge.onChange}
                    />
                  )}
                />
              ) : badge?.link ? (
                <Link href={badge.link}>
                  <Badge variant={badge?.variant} className="mt-1">
                    {badge?.text}
                  </Badge>
                </Link>
              ) : (
                <Badge variant={badge?.variant} className="mt-1">
                  {badge?.text}
                </Badge>
              )
            ) : null}
          </div>
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <EditableDescription
                field={field}
                placeholder={subtitlePlaceholder}
              />
            )}
          />
        </div>
        <div className="flex w-fit items-start gap-2 pt-1 pb-2 md:justify-end">
          {children}
          {locked && (
            <Button className="gap-2" onClick={() => setLocked(false)}>
              <PiPencilEditStroke className="h-4 w-4" />
              Edit
            </Button>
          )}
          {!locked && (
            <>
              <Button
                type="reset"
                className="gap-2"
                variant="outline"
                onClick={() => {
                  onReset?.()
                  form.reset(defaultValues)
                  setLocked(true)
                }}
              >
                <PiCrossCrossSquare className="h-4 w-4" />
                Cancel
              </Button>
              <Button
                className="gap-2"
                type="submit"
                /* disabled={!form.formState.isValid} */
              >
                <PiCheckTickSquareBrokenStroke className="h-4 w-4" />
                Save
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
