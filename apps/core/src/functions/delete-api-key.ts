import { SuccessResponse } from './utils/success-response'
import {
  getHandlerFromInternal,
  type InternalHandler,
} from './utils/handlers/internal-handler'
import { apiKeyDeleteSchema } from '@repo/shared/schemas/delete-api-key-schema'
import { deleteApiKey } from '@/ddb/delete-api-key'

type DeleteApiKeyResult = {
  success: boolean
  message: string
}

const deleteApiKeyHandler: InternalHandler<
  typeof apiKeyDeleteSchema,
  DeleteApiKeyResult
> = async ({ id }) => {
  await deleteApiKey(id)
  return new SuccessResponse<DeleteApiKeyResult>({
    success: true,
    message: 'Successfully deleted API key',
  }).toResponse()
}

export const handler = getHandlerFromInternal(
  deleteApiKeyHandler,
  apiKeyDeleteSchema,
)
