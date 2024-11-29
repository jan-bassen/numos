import { describe, expect } from '@jest/globals'
import { mockClient } from 'aws-sdk-client-mock'
import { handler } from '@/functions/create-api-key'
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb'
import { mockContext } from '@/test/mock/context'

const ddbMock = mockClient(DynamoDBDocumentClient)

describe('Testing lamda function create-api-key()', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('The request is valid', () => {
    const validRequest = {
      label: 'MockName',
      collection_id: '1e3116db-9cf2-4305-bc50-3ab5e8d14468',
    }

    test('Requesting a new API key', async () => {
      ddbMock.on(PutCommand).resolves({})
      const { result, error } = await handler(validRequest, mockContext)
      expect(error).toBeUndefined()
      expect(typeof result?.id).toBe('string')
      expect(typeof result?.clientSecret).toBe('string')
    })
  })

  describe('The request is NOT valid', () => {
    const invalidRequestBody = {
      label: undefined,
      collection_id: '1e3116db-9cf2-4305-bc50-3ab5e8d14468',
    }
    test('Requesting a new API key', async () => {
      ddbMock.on(PutCommand).resolves({})
      const { result, error } = await handler(invalidRequestBody as any)
      expect(result).toBeUndefined()
      expect(error).toBe('Label needs to be provided')
    })
  })
})
