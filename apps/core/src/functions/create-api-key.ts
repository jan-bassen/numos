import { SuccessResponse } from '@/functions/utils/success-response'
import {
  type InternalHandler,
  getHandlerFromInternal,
} from '@/functions/utils/handlers/internal-handler'
import { apiKeyRequestSchema } from '@repo/shared/schemas/validation/create-api-key-schema'
import { generateApiKey } from '@/authorizers/generate-api-key'
import type { ApiKeyEntry } from '@/types/ddb'
import { putApiKey } from '@/ddb/put-api-key'

type CreateApiKeyResult = {
  id: string
  clientSecret: string
}

const createApiKeyHandler: InternalHandler<
  typeof apiKeyRequestSchema,
  CreateApiKeyResult
> = async ({ label, collection_id }) => {
  const { id, clientSecret, encryptedKey, iv } = await generateApiKey()

  const item: ApiKeyEntry = {
    id,
    active: true,
    collection: collection_id,
    createdAt: new Date().toISOString(),
    label: label,
    encryptedKey,
    iv,
  }

  await putApiKey(item)

  return new SuccessResponse<CreateApiKeyResult>({
    id,
    clientSecret,
  }).toResponse()
}

export const handler = getHandlerFromInternal(
  createApiKeyHandler,
  apiKeyRequestSchema,
)
