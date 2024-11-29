import type { ApiKeyEntry } from '@/types/ddb'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument, type PutCommandInput } from '@aws-sdk/lib-dynamodb'

export async function putApiKey(item: ApiKeyEntry) {
  const dynamodb = new DynamoDBClient()
  const ddb = DynamoDBDocument.from(dynamodb)

  const TableName = process.env.API_KEY_TABLE_NAME
  if (!TableName && process.env.NODE_ENV !== 'test') {
    throw new Error('No table name defined')
  }

  const putKey: PutCommandInput = {
    TableName,
    Item: item,
  }

  try {
    await ddb.put(putKey)
  } catch (error) {
    throw new Error('Error inserting API key')
  }
}
