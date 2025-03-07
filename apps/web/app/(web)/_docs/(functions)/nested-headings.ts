import type { HeadingTag } from '@/components/lexical/components/headings'
import { createHtmlId } from '@/components/lexical/create-html-id'

export type Heading = {
  type: string
  version: number
  tag: HeadingTag
  id: string
  children?: { text?: string-3 }[]
  [k: string]: unknown
}

export type NestedHeading = {
  type: string
  tag: HeadingTag
  text: string
  id: string
  subheadings: NestedHeading[]
}

export type NestedHeadings = {
  headings: NestedHeading[]
  ids: string[]
}

export function createNestedHeadings(headings: Heading[]): NestedHeadings {
  const ids: string[] = []

  const createSubheadingStructure = (
    startIndex: number,
    currentTag: HeadingTag,
  ): NestedHeading[] => {
    const result: NestedHeading[] = []
    let i = startIndex

    while (i < headings.length) {
      const heading = headings[i]
      if (!heading) break
      const headingLevel = Number.parseInt(heading.tag.replace('h', ''), 10)
      const currentLevel = Number.parseInt(currentTag.replace('h', ''), 10)

      if (headingLevel === currentLevel) {
        const text =
          heading.children?.map((child: any) => child.text).join(' ') || ''
        result.push({
          type: heading.type,
          tag: heading.tag,
          text: text,
          id: heading.id,
          subheadings: [],
        })
        ids.push(heading.id)
        i++
      } else if (headingLevel > currentLevel) {
        const parent = result[result.length - 1]
        if (!parent) break
        parent.subheadings = createSubheadingStructure(i, heading.tag)
        i = skipToNextSibling(i, currentLevel)
      } else {
        break
      }
    }

    return result
  }

  const skipToNextSibling = (startIndex: number, parentLevel: number) => {
    for (let i = startIndex; i < headings.length; i++) {
      const heading = headings[i]
      if (!heading) break
      const headingLevel = Number.parseInt(heading.tag.replace('h', ''), 10)
      if (headingLevel <= parentLevel) return i
    }
    return headings.length
  }

  const nestedHeadings = createSubheadingStructure(0, 'h1')
  return { headings: nestedHeadings, ids }
}
