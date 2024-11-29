import * as cdk from 'aws-cdk-lib'

import { AttributeType, Billing, TableV2 } from 'aws-cdk-lib/aws-dynamodb'
import { Effect, PolicyStatement, User } from 'aws-cdk-lib/aws-iam'
import {
  Code,
  Function as LambdaFunction,
  Runtime,
} from 'aws-cdk-lib/aws-lambda'
import type { Construct } from 'constructs'

export class CoreStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    // <---------------------- USERS --------------------->

    const studioUser = new User(this, 'Studio', {})

    // <---------------------- API KEYS --------------------->

    const apiKeysTable = new TableV2(this, 'ApiKeys', {
      partitionKey: { name: 'id', type: AttributeType.STRING },
      billing: Billing.onDemand(),
    })

    // --- Create API Key ---

    const createApiKey = new LambdaFunction(this, 'CreateApiKey', {
      functionName: 'CoreStack-CreateApiKey',
      runtime: Runtime.NODEJS_20_X,
      code: Code.fromAsset('dist/functions'),
      handler: 'create-api-key.handler',
      environment: {
        API_KEY_TABLE_NAME: apiKeysTable.tableName,
      },
    })

    apiKeysTable.grantWriteData(createApiKey)
    studioUser.addToPolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ['lambda:InvokeFunction'],
        resources: [createApiKey.functionArn],
      }),
    )

    // --- Delete API Key ---

    const deleteApiKey = new LambdaFunction(this, 'DeleteApiKey', {
      functionName: 'CoreStack-DeleteApiKey',
      runtime: Runtime.NODEJS_20_X,
      code: Code.fromAsset('dist/functions'),
      handler: 'delete-api-key.handler',
      environment: {
        API_KEY_TABLE_NAME: apiKeysTable.tableName,
      },
    })

    apiKeysTable.grantWriteData(deleteApiKey)
    studioUser.addToPolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ['lambda:InvokeFunction'],
        resources: [deleteApiKey.functionArn],
      }),
    )
  }
}
