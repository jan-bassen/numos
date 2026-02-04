import { Err } from '@repo/shared/result/err'
import type { ZodIssue } from 'zod'

export class ValidationErr extends Err<'validation'> {
  constructor(message: string, issues: ZodIssue[]) {
    super(message, 'validation', { issues })
  }
}
