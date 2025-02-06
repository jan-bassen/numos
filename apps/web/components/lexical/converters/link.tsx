import type {
  SerializedAutoLinkNode,
  SerializedLinkNode,
} from '@payloadcms/richtext-lexical'
import type { JSXConverters } from '@payloadcms/richtext-lexical/react'
import { RichTextLink } from '../components/link'

export const customLinkConverter: (args: {
  internalDocToHref?: (args: { linkNode: SerializedLinkNode }) => string
}) => JSXConverters<SerializedAutoLinkNode | SerializedLinkNode> = ({
  internalDocToHref,
}) => ({
  autolink: ({ node, nodesToJSX }) => {
    const children = nodesToJSX({
      nodes: node.children,
    })

    const rel: string | undefined = node.fields.newTab
      ? 'noopener noreferrer'
      : undefined
    const target: string | undefined = node.fields.newTab ? '_blank' : undefined

    if (!node.fields.url) {
      console.error(
        'Lexical => JSX converter: Link converter: found link with no URL',
      )
      return null
    }

    return (
      <RichTextLink href={node.fields.url} {...{ rel, target }}>
        {children}
      </RichTextLink>
    )
  },
  link: ({ node, nodesToJSX }) => {
    const children = nodesToJSX({
      nodes: node.children,
    })

    const rel: string | undefined = node.fields.newTab
      ? 'noopener noreferrer'
      : undefined
    const target: string | undefined = node.fields.newTab ? '_blank' : undefined

    if (!node.fields.url) {
      console.error(
        'Lexical => JSX converter: Link converter: found link with no URL',
      )
      return null
    }

    let href: string = node.fields.url
    if (node.fields.linkType === 'internal') {
      if (internalDocToHref) {
        href = internalDocToHref({ linkNode: node })
      } else {
        console.error(
          'Lexical => JSX converter: Link converter: found internal link, but internalDocToHref is not provided',
        )
        href = '#' // fallback
      }
    }

    return (
      <RichTextLink href={href} {...{ rel, target }}>
        {children}
      </RichTextLink>
    )
  },
})
