import * as cdk from 'aws-cdk-lib'
import { AttributeType, Billing, TableV2 } from 'aws-cdk-lib/aws-dynamodb'
import {
  Code,
  Function as LambdaFunction,
  Runtime,
} from 'aws-cdk-lib/aws-lambda'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'
import type { Construct } from 'constructs'
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CoreStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const apiKeysTable = new TableV2(this, 'ApiKeys', {
      partitionKey: { name: 'id', type: AttributeType.STRING },
      billing: Billing.onDemand(),
    })

    const createApiKey = new LambdaFunction(this, 'CreateApiKey', {
      runtime: Runtime.NODEJS_18_X,
      code: Code.fromAsset('dist/functions'),
      handler: 'create-api-key.handler',
      environment: {
        TABLE_NAME: apiKeysTable.tableName,
      },
    })

    apiKeysTable.grantWriteData(createApiKey)
  }
}
