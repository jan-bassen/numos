import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import {
  type DeleteCommandInput,
  DynamoDBDocument,
} from '@aws-sdk/lib-dynamodb'

export async function deleteApiKey(keyId: string): Promise<void> {
  const dynamodb = new DynamoDBClient()
  const ddb = DynamoDBDocument.from(dynamodb)

  const TableName = process.env.API_KEY_TABLE_NAME
  if (!TableName && process.env.NODE_ENV !== 'test') {
    throw new Error('No table name defined')
  }

  const deleteKey: DeleteCommandInput = {
    TableName,
    Key: {
      id: keyId,
    },
  }

  try {
    await ddb.delete(deleteKey)
  } catch (error) {
    throw new Error('Error deleting API key')
  }
}
