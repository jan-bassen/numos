import { metadataSchema } from '@repo/shared/schemas/blockchains/nft-metadata'
import { pgEnum } from 'drizzle-orm/pg-core'
import { z } from 'zod'

export const imageSchema = z.object({
  cachedUrl: z.string().optional(),
  thumbnailUrl: z.string().optional(),
  pngUrl: z.string().optional(),
  originalUrl: z.string().optional(),
  size: z.number().optional(),
  contentType: z.string().optional(),
})

export const cachedMetadataSchema = z.object({
  tokenUri: z.string().optional(),
  metadata: z.any().optional(), // metadataSchema.optional(),
  error: z.string().nullable().optional(),
})

export const tokenTypeEnum = pgEnum('token_type', ['ERC721', 'ERC1155'])
