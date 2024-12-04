import { SuccessResponse } from '@/functions/utils/success-response'
import {
  type InternalHandler,
  getHandlerFromInternal,
} from './utils/handlers/internal-handler'
import { listApiKeySchema } from '@repo/shared/schemas/list-api-key-schema'
import type { ApiKeyPublicEntry } from '@/types/ddb'
import { scanApiKeys } from '@/ddb/scan-api-keys'

type CreateApiKeyResult = {
  keys: ApiKeyPublicEntry[]
}

const listApiKeysHandler: InternalHandler<
  typeof listApiKeySchema,
  CreateApiKeyResult
> = async ({ collection_id }) => {
  const keys = await scanApiKeys(collection_id)

  return new SuccessResponse<CreateApiKeyResult>({
    keys,
  }).toResponse()
}

export const handler = getHandlerFromInternal(
  listApiKeysHandler,
  listApiKeySchema,
)
