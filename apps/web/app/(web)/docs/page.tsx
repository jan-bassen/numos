import { Separator } from '@repo/ui/components/ui/separator'
import { payload } from '@/lib/payload/client'
import { addHeadingIds } from '@/app/(web)/docs/(functions)/add-heading-ids'
import { notFound } from 'next/navigation'
import { RichText } from '@/components/lexical/rich-text'
import { OnThisPage } from '@/app/(web)/docs/(components)/docs-toc'
import {
  createNestedHeadings,
  type Heading,
} from '@/app/(web)/docs/(functions)/nested-headings'

export default async function DocsPage() {
  notFound()

  const res = await payload.find({
    collection: 'docs',
    where: {
      group: {
        equals: 'home',
      },
    },
  })
  const _article = res.docs[0]
  if (!_article) notFound()
  //@ts-ignore
  const article = addHeadingIds(_article)
  const headings = article.content.root.children.filter(
    (node) =>
      node.type === 'heading' &&
      (node.tag === 'h1' || node.tag === 'h2' || node.tag === 'h3'),
  )

  const nestedHeadings = createNestedHeadings(headings as Heading[])
  return (
    <div className="relative flex w-full gap-6">
      <main className="flex w-full flex-col gap-6 px-6 sm:px-10 md:pl-0 lg:px-0">
        <div className="flex w-full flex-col gap-3">
          <h1 className="w-full font-extrabold font-poppins text-4xl">
            {article.title}
          </h1>
          <p className="w-full font-inter text-secondary-foreground/60">
            {article.description}
          </p>
        </div>
        <Separator className="h-[2px]" />
        <RichText data={article.content} className="" />
      </main>
      <div className="relative -lg:hidden w-56 shrink-0 mr-2">
        <OnThisPage nestedHeadings={nestedHeadings} />
      </div>
    </div>
  )
}
