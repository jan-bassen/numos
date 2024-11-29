//TODO: Use everywhere

export type Result<ResultType, ErrorType = string> =
  | {
      result: ResultType
      error: undefined
    }
  | {
      result: undefined
      error: ErrorType
    }
