import type {
  ValidationIssueData,
  ValidationIssueInfo,
  ValidationIssueOrigin,
} from '@repo/shared/types/validation-types'
import type { Result } from '@repo/shared/types/result'

export class ValidationIssue {
  name = 'ValidationError'
  constructor(
    public message: string,
    public origin: ValidationIssueOrigin,
    public info: ValidationIssueInfo,
  ) {}
  serialize = (): ValidationIssueData => {
    return {
      message: this.message,
      info: this.info,
      origin: this.origin,
    }
  }
  toResult = (): Result<boolean, ValidationIssueData> => {
    return { error: this.serialize() }
  }
  toArrayResult = (): Result<boolean, ValidationIssueData[]> => {
    return { error: [this.serialize()] }
  }
}
