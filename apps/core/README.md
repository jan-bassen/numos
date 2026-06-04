# core

The Numos backend, defined as infrastructure-as-code with the [AWS CDK](https://aws.amazon.com/cdk/) in TypeScript.

It provisions the core stack — API authorizers, Lambda functions, and DynamoDB-backed API key management. The `cdk.json` file tells the CDK Toolkit how to execute the app.

## Layout

- `src/stacks` — CDK stack definitions
- `src/functions` — Lambda handlers
- `src/authorizers` — API request authorization and API key generation
- `src/ddb` — DynamoDB access helpers
- `src/db` — Drizzle schema and client

## Useful commands

```sh
pnpm build        # compile TypeScript to JS
pnpm watch        # watch for changes and compile
pnpm test         # run the Jest unit tests
npx cdk deploy    # deploy this stack to your default AWS account/region
npx cdk diff      # compare deployed stack with current state
npx cdk synth     # emit the synthesized CloudFormation template
```
