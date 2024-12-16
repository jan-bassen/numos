import type { SerializedHeadingNode } from '@payloadcms/richtext-lexical'
import type { JSXConverters } from '@payloadcms/richtext-lexical/react'
import { RichTextHeading } from '../components/headings'

export const customHeadingConverter: JSXConverters<
  SerializedHeadingNode & { id: string }
> = {
  heading: ({ node, nodesToJSX, ...props }) => {
    const children = nodesToJSX({
      nodes: node.children,
    })
    return (
      <RichTextHeading tag={node.tag} id={node.id}>
        {children}
      </RichTextHeading>
    )
  },
}
