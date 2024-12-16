import { payload } from '@/lib/payload/client'
import { cn } from '@repo/ui/lib/utils'
import { pages } from 'next/dist/build/templates/app-page'
import Link from 'next/link'

const mockStudioPages = [
  {
    title: 'Introduction',
    slug: 'introduction',
    active: true,
  },
  {
    title: 'Getting Started',
    slug: 'getting-started',
    active: false,
  },
  {
    title: 'Collections',
    slug: 'collections',
    active: false,
  },
  {
    title: 'Attributes',
    slug: 'attributes',
    active: false,
  },
  {
    title: 'Actions',
    slug: 'actions',
    active: false,
  },
  {
    title: 'Image',
    slug: 'image',
    active: false,
  },
  {
    title: 'Logic Editor',
    slug: 'logic-editor',
    active: false,
  },
  {
    title: 'Nodes',
    slug: 'nodes',
    active: false,
  },
]

export async function DocsNavigation() {
  /*  const res = await payload.find(¨
    collection: 'docs'

  }) */
  return (
    <div className="sticky top-30 flex flex-col gap-2">
      <h1 className="font-extrabold font-poppins text-muted-foreground text-xs">
        STUDIO
      </h1>
      <ul className="flex flex-col gap-2">
        {mockStudioPages.map((page) => (
          <li
            key={page.slug}
            className="font-light text-secondary-foreground/90"
          >
            <Link
              className={cn(
                'hover:text-primary hover:underline',
                page.active && 'text-primary underline',
              )}
              href={`/docs/studio/${page.slug}`}
            >
              {page.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
