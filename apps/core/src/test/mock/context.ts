import type { Context } from 'aws-lambda'

export const mockContext: Context = {
  callbackWaitsForEmptyEventLoop: true,
  succeed: () => undefined,
  fail: () => undefined,
  done: () => undefined,
  functionVersion: '$LATEST',
  functionName: 'CoreStack-CreateApiKeyD1AF533F-CKXy2H2hRV4f',
  memoryLimitInMB: '128',
  logGroupName: '/aws/lambda/CoreStack-CreateApiKeyD1AF533F-CKXy2H2hRV4f',
  logStreamName: '2024/11/25/[$LATEST]979e7783e5cd4585b5844b17d7e308e0',
  clientContext: undefined,
  identity: undefined,
  invokedFunctionArn:
    'arn:aws:lambda:eu-central-1:601179749333:function:CoreStack-CreateApiKeyD1AF533F-CKXy2H2hRV4f',
  awsRequestId: 'f256ba90-e0d7-485e-b445-17436bed7780',
  getRemainingTimeInMillis: () => 1000,
}
