import {
  NodeFormat,
  type SerializedTextNode,
} from '@payloadcms/richtext-lexical'
import type { JSXConverters } from '@payloadcms/richtext-lexical/react'
import type React from 'react'
import { RichTextStyles } from '../components/text'

export const customTextConverter: JSXConverters<SerializedTextNode> = {
  text: ({ node }) => {
    return <RichTextStyles format={node.format}>{node.text}</RichTextStyles>
  },
}
