import type {
  SerializedListItemNode,
  SerializedListNode,
} from '@payloadcms/richtext-lexical'
import type { JSXConverters } from '@payloadcms/richtext-lexical/react'
import {
  RichTextCheckboxListItem,
  RichTextList,
  RichTextListItem,
} from '../components/list'

export const customListConverter: JSXConverters<
  SerializedListItemNode | SerializedListNode
> = {
  list: ({ node, nodesToJSX }) => {
    const children = nodesToJSX({
      nodes: node.children,
    })

    return (
      <RichTextList tag={node.tag} className={`list-${node?.listType}`}>
        {children}
      </RichTextList>
    )
  },
  listitem: ({ node, nodesToJSX, parent }) => {
    const hasSubLists = node.children.some((child) => child.type === 'list')

    const children = nodesToJSX({
      nodes: node.children,
    })

    if ('listType' in parent && parent?.listType === 'check') {
      return (
        <RichTextCheckboxListItem
          checked={node?.checked}
          hasSubLists={hasSubLists}
          value={node?.value}
        >
          {children}
        </RichTextCheckboxListItem>
      )
    }
    return (
      <RichTextListItem
        className={hasSubLists ? 'nestedListItem' : ''}
        value={node?.value}
      >
        {children}
      </RichTextListItem>
    )
  },
}
