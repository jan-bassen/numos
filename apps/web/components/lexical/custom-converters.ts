import type { DefaultNodeTypes } from '@payloadcms/richtext-lexical'
import {
  type JSXConverters,
  ParagraphJSXConverter,
  TextJSXConverter,
  LinebreakJSXConverter,
  BlockquoteJSXConverter,
  TableJSXConverter,
  HeadingJSXConverter,
  HorizontalRuleJSXConverter,
  ListJSXConverter,
  LinkJSXConverter,
  UploadJSXConverter,
} from '@payloadcms/richtext-lexical/react'
import { customParagraphConverter } from './converters/paragraph'
import { customBlockquoteConverter } from './converters/blockquote'
import { customHeadingConverter } from './converters/heading'
import { customListConverter } from './converters/list'
import { customLinkConverter } from './converters/link'
import { customUploadConverter } from './converters/upload'
import { customTextConverter } from './converters/text'
import { customTableConverter } from './converters/table'

export const customJSXConverters: JSXConverters<DefaultNodeTypes> = {
  ...customLinkConverter({}),
  ...customParagraphConverter,
  ...customBlockquoteConverter,
  ...customHeadingConverter,
  ...customListConverter,
  ...customUploadConverter,
  ...customTextConverter,
  ...customTableConverter,
  ...LinebreakJSXConverter,
  ...HorizontalRuleJSXConverter,
}
