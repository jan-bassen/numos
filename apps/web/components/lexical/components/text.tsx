import { NodeFormat } from '@payloadcms/richtext-lexical'

export function RichTextStyles({
  children,
  format,
}: {
  children: React.ReactNode
  format?: number
}) {
  switch (format) {
    case NodeFormat.IS_BOLD:
      return (
        <strong className="text-secondary-foreground/95">{children}</strong>
      )
    case NodeFormat.IS_ITALIC:
      return <em>{children}</em>
    case NodeFormat.IS_STRIKETHROUGH:
      return <span className="line-through">{children}</span>
    case NodeFormat.IS_UNDERLINE:
      return <span className="underline">{children}</span>
    case NodeFormat.IS_CODE:
      return <code>{children}</code>
    case NodeFormat.IS_SUBSCRIPT:
      return <sub>{children}</sub>
    case NodeFormat.IS_SUPERSCRIPT:
      return <sup>{children}</sup>
    default:
      return children
  }
}
