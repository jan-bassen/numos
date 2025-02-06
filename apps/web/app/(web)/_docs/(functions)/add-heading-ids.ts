import type { Doc } from '@/payload-types'

export function addHeadingIds(article: Doc) {
  const children = article.content.root.children.map((node) => {
    if (node.type === 'heading') {
      return {
        ...node,
        id: crypto.randomUUID(),
      }
    }
    return node
  })
  return {
    ...article,
    content: {
      ...article.content,
      root: {
        ...article.content.root,
        children,
      },
    },
  }
}
