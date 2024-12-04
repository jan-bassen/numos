import { describe, expect } from '@jest/globals'
import { mockClient } from 'aws-sdk-client-mock'
import { handler } from '@/functions/delete-api-key'
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  PutCommand,
} from '@aws-sdk/lib-dynamodb'

const ddbMock = mockClient(DynamoDBDocumentClient)

describe('Testing lamda function delete-api-key()', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('The request is valid', () => {
    const validRequestBody = { id: '1e3116db-9cf2-4305-bc50-3ab5e8d14468' }

    test('Requesting to delete an API key', async () => {
      ddbMock.on(DeleteCommand).resolves({})
      const { result, error } = await handler(validRequestBody)
      expect(error).toBeUndefined()
      expect(result?.success).toBe(true)
      expect(typeof result?.message).toBe('string')
    })
  })

  describe('The request is NOT valid', () => {
    const invalidRequestBody = { id: undefined }
    test('Requesting to delete an API key', async () => {
      ddbMock.on(PutCommand).resolves({})
      const { result, error } = await handler(invalidRequestBody as any)
      expect(result).toBeUndefined()
      expect(typeof error).toBe('string')
    })
  })
})
