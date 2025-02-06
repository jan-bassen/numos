import type { ParagraphJSXConverter } from '@payloadcms/richtext-lexical/react'
import { RichTextParagraph } from '../components/paragraph'

export const customParagraphConverter: typeof ParagraphJSXConverter = {
  paragraph: ({ node, nodesToJSX }) => {
    const children = nodesToJSX({
      nodes: node.children,
    })

    return <RichTextParagraph>{children}</RichTextParagraph>
  },
}
