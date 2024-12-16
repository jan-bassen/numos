import { useEffect, useState } from 'react'

export function useHeadingInView(
  headingSelectors = ['h1', 'h2', 'h3'],
  options = { rootMargin: '0px 0px -80% 0px', threshold: 0 },
) {
  const [activeHeadingId, setActiveHeadingId] = useState<string | null>(null)

  useEffect(() => {
    const headings = Array.from(
      document.querySelectorAll(headingSelectors.join(', ')),
    )
    if (!headings.length) return

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting && entry.target.id) {
          setActiveHeadingId(entry.target.id)
        }
      }
    }, options)

    // biome-ignore lint/complexity/noForEach: <explanation>
    headings.forEach((heading) => observer.observe(heading))

    return () => {
      observer.disconnect()
    }
  }, [headingSelectors, options])

  return activeHeadingId
}
