'use server'

import type { z } from 'zod'
import { createLambdaClient } from '@/lib/core/clients/lambda'
import { InvokeCommand } from '@aws-sdk/client-lambda'
import type { apiKeyRequestSchema } from '@repo/shared/schemas/api-keys/create-api-key-schema'

export async function createApiKey(data: z.infer<typeof apiKeyRequestSchema>) {
  const lambda = createLambdaClient()
  const command = new InvokeCommand({
    FunctionName: 'CoreStack-CreateApiKey',
    Payload: JSON.stringify(data),
  })
  const res = await lambda.send(command)
  if (res.StatusCode !== 200) {
    throw new Error('Failed to create API key')
  }
  //@ts-ignore
  const key = Buffer.from(res.Payload).toString()
  console.log(key)
}
