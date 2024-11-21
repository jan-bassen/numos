import { GraphError } from '@repo/engine/errors/graph-error'
import type { Handler } from 'aws-lambda'
import DynamoDB from 'aws-sdk/clients/dynamodb'

export const handler: Handler = async (event, context) => {
  const dynamodb = new DynamoDB()
  const engine = new GraphError("Hello, World Number 2!", {node: "test"})

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({ message: 'Hello, World Number 2!' }),
  }
}
