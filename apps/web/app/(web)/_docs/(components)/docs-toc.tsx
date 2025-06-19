'use client'

import { Button } from '@repo/ui/components/button'
import { Separator } from '@repo/ui/components/separator'
import { PiArrowUpCircleStroke } from '@repo/ui/icons/pika'
import { cn } from '@repo/ui/lib/utils'
import { useScrollPosition } from '@repo/ui/hooks/use-scroll-position'
import { useHeadingInView } from '@repo/ui/hooks/use-heading-in-view'
import type {
  NestedHeading,
  NestedHeadings,
} from '../(functions)/nested-headings'

function OTPButton({
  heading,
  className,
  active,
}: {
  heading: NestedHeading
  className?: string
  active?: boolean
}) {
  return (
    <Button
      variant={'ghost'}
      size={'none'}
      className={cn(
        ' !line-clamp-1 !text-ellipsis h-6 rounded-xs border-background border-l-2 px-2 text-left font-light text-secondary-foreground/90 hover:border-muted',
        className,
      )}
      onClick={() => {
        const headingElement = document.getElementById(heading.id)
        if (!headingElement) return
        const yOffset = -80
        const y =
          headingElement.getBoundingClientRect().top + window.scrollY + yOffset
        window.scrollTo({
          top: y,
          behavior: 'smooth',
        })
      }}
    >
      {heading.text}
    </Button>
  )
}

export function OnThisPage({
  nestedHeadings,
}: { nestedHeadings: NestedHeadings }) {
  const scrollY = useScrollPosition()
  const { headings, ids } = nestedHeadings
  const activeHeadingId = useHeadingInView()

  if (headings.length === 0) return null
  const index = ids.findIndex((id) => id === activeHeadingId)

  return (
    <div className="sticky top-30 flex flex-col gap-2">
      <h1 className="px-1.5 font-extrabold font-heading text-muted-foreground text-xs">
        ON THIS PAGE
      </h1>
      <ul className="relative flex flex-col gap-2">
        {index !== -1 && (
          <div
            className="absolute left-0 h-5 w-[2px] bg-muted-foreground transition-all duration-300 ease-in-out"
            style={{
              top: `${index * 32 + 2}px`,
            }}
          />
        )}
        {headings.map((heading) => (
          <li key={heading.id} className="flex flex-col gap-2">
            <OTPButton heading={heading} />
            {heading.subheadings.length > 0 && (
              <ul className="flex flex-col gap-2">
                {heading.subheadings.map((subheading) => (
                  <li key={subheading.id}>
                    <OTPButton heading={subheading} className="ml-5" />
                    {subheading.subheadings.length > 0 && (
                      <ul className="flex flex-col gap-2">
                        {subheading.subheadings.map((subsubheading) => (
                          <li key={subsubheading.id}>
                            <OTPButton
                              heading={subsubheading}
                              className="ml-10"
                            />
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
      {scrollY > 100 && (
        <>
          <Separator className="my-0.5" />
          <Button
            variant={'ghost'}
            size={'none'}
            className={cn(
              'h-7 justify-start gap-1.5 rounded-xs px-2 font-light text-secondary-foreground/90',
            )}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <PiArrowUpCircleStroke className="size-4 text-muted-foreground" />
            Back to top
          </Button>
        </>
      )}
    </div>
  )
}
