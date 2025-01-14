import type { ApiKeyPublicEntry } from '@/types/ddb'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument, type ScanCommandInput } from '@aws-sdk/lib-dynamodb'

export async function scanApiKeys(
  collection: string,
): Promise<ApiKeyPublicEntry[]> {
  const dynamodb = new DynamoDBClient()
  const ddb = DynamoDBDocument.from(dynamodb)

  const TableName = process.env.API_KEY_TABLE_NAME
  if (!TableName && process.env.NODE_ENV !== 'test') {
    throw new Error('No table name defined')
  }

  const scanKeys: ScanCommandInput = {
    TableName,
    ScanFilter: {
      collection: {
        ComparisonOperator: 'EQ',
        AttributeValueList: [collection],
      },
    },
  }

  try {
    const result = await ddb.scan(scanKeys)
    if (!result.Items) {
      throw new Error('Key not found')
    }
    return result.Items.map((item) => ({
      id: item.id as string,
      active: item.active as boolean,
      createdAt: item.createdAt as string,
      label: item.label as string,
    }))
  } catch (error) {
    throw new Error('Error getting key')
  }
}
