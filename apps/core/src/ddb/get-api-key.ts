import type { ApiKeyEntry } from '@/types/ddb'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument, type GetCommandInput } from '@aws-sdk/lib-dynamodb'

export async function getApiKey(keyId: string): Promise<ApiKeyEntry> {
  const dynamodb = new DynamoDBClient()
  const ddb = DynamoDBDocument.from(dynamodb)

  const TableName = process.env.API_KEY_TABLE_NAME
  if (!TableName && process.env.NODE_ENV !== 'test') {
    throw new Error('No table name defined')
  }

  const getKey: GetCommandInput = {
    TableName,
    Key: {
      id: keyId,
    },
  }

  try {
    const result = await ddb.get(getKey)
    if (!result.Item) {
      throw new Error('Key not found')
    }
    //TODO: Validate type
    return result.Item as ApiKeyEntry
  } catch (error) {
    throw new Error('Error getting key')
  }
}
