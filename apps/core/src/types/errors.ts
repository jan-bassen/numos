export type InternalErrorCode =
  | 500
  | 501
  | 502
  | 503
  | 504
  | 505
  | 506
  | 507
  | 508
  | 509
  | 510
  | 511

export type ApiErrorCode = InternalErrorCode | RequestErrorCode

export type ApiErrorData = {
  statusCode: ApiErrorCode
  message: string
}

export type RequestErrorCode =
  | 400
  | 401
  | 403
  | 404
  | 405
  | 406
  | 409
  | 410
  | 411
  | 412
  | 413
  | 414
  | 415
  | 416
  | 417
  | 418
  | 422
  | 423
  | 424
  | 425
  | 426
  | 428
  | 429
  | 431
  | 451
