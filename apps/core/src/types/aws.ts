import type { Callback, Context, Handler } from 'aws-lambda'

//TODO: Do I need to type this?
export type LambdaHandler<E, R> = (
  event: E,
  context?: Context,
  callback?: Callback,
) => Promise<R>
