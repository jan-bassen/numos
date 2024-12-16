import type { ComponentProps, ReactNode } from 'react'

const headingComponents = {
  h1: (props: ComponentProps<'h1'>) => <h1 {...props} />,
  h2: (props: ComponentProps<'h2'>) => <h2 {...props} />,
  h3: (props: ComponentProps<'h3'>) => <h3 {...props} />,
  h4: (props: ComponentProps<'h4'>) => <h4 {...props} />,
  h5: (props: ComponentProps<'h5'>) => <h5 {...props} />,
  h6: (props: ComponentProps<'h6'>) => <h6 {...props} />,
} as const

export type HeadingTag = keyof typeof headingComponents

const headingClassNames: Record<HeadingTag, string> = {
  h1: 'text-secondary-foreground w-fit text-2xl font-bold pt-4 font-poppins',
  h2: 'text-secondary-foreground w-fit text-xl font-bold pt-4 font-poppins',
  h3: 'text-secondary-foreground w-fit text-lg font-bold pt-2 font-poppins',
  h4: 'text-secondary-foreground w-fit text-lg font-semibold pt-2 font-poppins',
  h5: 'text-secondary-foreground w-fit text-base font-semibold',
  h6: 'text-secondary-foreground w-fit text-base font-semibold',
}

export function RichTextHeading<T extends HeadingTag>({
  tag,
  children,
  id,
}: {
  tag: T
  children: ReactNode[]
  id?: string
}) {
  const Component = headingComponents[tag]
  return Component({ className: headingClassNames[tag], children, id })
}
