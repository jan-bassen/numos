import React from 'react'
import {
  type JSXConvertersFunction,
  RichText as RichTextLexical,
} from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { customJSXConverters } from './custom-converters'
import { cn } from '@repo/ui/lib/utils'

const jsxConverters: JSXConvertersFunction = () => ({
  ...customJSXConverters,
  blocks: {},
})

export const RichText = ({
  data,
  className,
}: { data: SerializedEditorState; className?: string }) => {
  return (
    <RichTextLexical
      className={cn('space-y-2 text-secondary-foreground/80', className)}
      converters={jsxConverters}
      data={data}
    />
  )
}
