import type { SerializedQuoteNode } from '@payloadcms/richtext-lexical'
import type { JSXConverters } from '@payloadcms/richtext-lexical/react'
import { RichTextBlockquote } from '../components/blockquote'

export const customBlockquoteConverter: JSXConverters<SerializedQuoteNode> = {
  quote: ({ node, nodesToJSX }) => {
    const children = nodesToJSX({
      nodes: node.children,
    })

    return <RichTextBlockquote>{children}</RichTextBlockquote>
  },
}
