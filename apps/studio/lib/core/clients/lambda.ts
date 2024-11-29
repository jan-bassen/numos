import { LambdaClient } from '@aws-sdk/client-lambda'

export const createLambdaClient = () => {
  const { CORE_ID, CORE_KEY, CORE_REGION } = process.env
  if (!CORE_ID || !CORE_KEY || !CORE_REGION) {
    throw new Error('CORE_ID, CORE_KEY, and CORE_REGION must be set')
  }
  return new LambdaClient({
    region: CORE_REGION,
    credentials: {
      accessKeyId: CORE_ID,
      secretAccessKey: CORE_KEY,
    },
  })
}
