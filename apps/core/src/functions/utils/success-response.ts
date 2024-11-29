import type { Response } from '@/types/responses'

export class SuccessResponse<R> {
  constructor(
    public body: R,
    public contentType = 'application/json',
  ) {}
  toHttpResponse() {
    return {
      statusCode: 200,
      isBase64Encoded: false,
      headers: {
        'Content-Type': this.contentType,
      },
      body: JSON.stringify(this.body),
    }
  }
  toResponse(): Response<R> {
    return { result: this.body, error: undefined }
  }
}
