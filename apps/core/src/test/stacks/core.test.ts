import { App } from 'aws-cdk-lib'
import { Match, Template } from 'aws-cdk-lib/assertions'
import { CoreStack } from '@/stacks/core-stack'

describe('Testing core stack template', () => {
  let coreTemplate: Template

  beforeAll(() => {
    const app = new App({
      outdir: 'cdk.out',
    })
    const stack = new CoreStack(app, 'CoreStack')
    coreTemplate = Template.fromStack(stack)
  })

  test('Lambda properties', () => {
    coreTemplate.hasResource(
      'AWS::Lambda::Function',
      Match.objectLike({
        Properties: {
          FunctionName: 'CoreStack-CreateApiKey',
          Handler: 'create-api-key.handler',
          Runtime: 'nodejs20.x',
          Environment: {
            Variables: {
              API_KEY_TABLE_NAME: {
                Ref: Match.stringLikeRegexp('ApiKeys'),
              },
            },
          },
          Role: {
            'Fn::GetAtt': Match.arrayWith([
              Match.stringLikeRegexp('CreateApiKeyServiceRole'),
              'Arn',
            ]),
          },
          Code: {
            S3Bucket: {
              'Fn::Sub': Match.anyValue(),
            },
            S3Key: Match.anyValue(),
          },
        },
        DependsOn: Match.arrayWith([
          Match.stringLikeRegexp('CreateApiKeyServiceRoleDefaultPolicy'),
          Match.stringLikeRegexp('CreateApiKeyServiceRole'),
        ]),
      }),
    )
  })

  test('DynamoDB properties', () => {
    coreTemplate.hasResourceProperties(
      'AWS::DynamoDB::GlobalTable',
      Match.objectLike({
        KeySchema: Match.arrayWith([
          {
            AttributeName: 'id',
            KeyType: 'HASH',
          },
        ]),
      }),
    )
  })

  // end
})
