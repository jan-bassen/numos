export type HttpResponse = {
  statusCode: number
  isBase64Encoded: boolean
  headers: {
    'Content-Type': string
    [key: string]: string
  }
  multiValueHeaders?: {
    [key: string]: string[]
  }
  body: string
}

export type HttpInternalErrorType = keyof typeof httpErrorCodes

export type HttpErrorType = HttpInternalErrorType

export type HttpErrorData = {
  statusCode: HttpErrorType
  message: string
}

export const httpErrorCodes = {
  'Request: Bad Request': { code: 400, message: 'Bad Request' },
  'Request: Unauthorized': { code: 401, message: 'Unauthorized' },
  'Request: Forbidden': { code: 403, message: 'Forbidden' },
  'Request: Not Found': { code: 404, message: 'Not Found' },
  'Request: Method Not Allowed': { code: 405, message: 'Method Not Allowed' },
  'Request: Not Acceptable': { code: 406, message: 'Not Acceptable' },
  'Request: Conflict': { code: 409, message: 'Conflict' },
  'Request: Gone': { code: 410, message: 'Gone' },
  'Request: Length Required': { code: 411, message: 'Length Required' },
  'Request: Precondition Failed': {
    code: 412,
    message: 'Precondition Failed',
  },
  'Request: Payload Too Large': { code: 413, message: 'Payload Too Large' },
  'Request: URI Too Long': { code: 414, message: 'URI Too Long' },
  'Request: Unsupported Media Type': {
    code: 415,
    message: 'Unsupported Media Type',
  },
  'Request: Range Not Satisfiable': {
    code: 416,
    message: 'Range Not Satisfiable',
  },
  'Request: Expectation Failed': { code: 417, message: 'Expectation Failed' },
  "Request: I'm a teapot": { code: 418, message: "I'm a teapot" },
  'Request: Unprocessable Entity': {
    code: 422,
    message: 'Unprocessable Entity',
  },
  'Request: Locked': { code: 423, message: 'Locked' },
  'Request: Failed Dependency': { code: 424, message: 'Failed Dependency' },
  'Request: Too Early': { code: 425, message: 'Too Early' },
  'Request: Upgrade Required': { code: 426, message: 'Upgrade Required' },
  'Request: Use TLS Client Certificate': {
    code: 428,
    message: 'Use TLS Client Certificate',
  },
  'Request: Too Many Requests': { code: 429, message: 'Too Many Requests' },
  'Request: Request Header Fields Too Large': {
    code: 431,
    message: 'Request Header Fields Too Large',
  },
  'Request: Unavailable For Legal Reasons': {
    code: 451,
    message: 'Unavailable For Legal Reasons',
  },
  'Internal: Internal Server Error': {
    code: 500,
    message: 'Internal Server Error',
  },
  'Internal: Not Implemented': { code: 501, message: 'Not Implemented' },
  'Internal: Bad Gateway': { code: 502, message: 'Bad Gateway' },
  'Internal: Service Unavailable': {
    code: 503,
    message: 'Service Unavailable',
  },
  'Internal: Gateway Timeout': { code: 504, message: 'Gateway Timeout' },
  'Internal: HTTP Version Not Supported': {
    code: 505,
    message: 'HTTP Version Not Supported',
  },
  'Internal: Variant Also Negotiates': {
    code: 506,
    message: 'Variant Also Negotiates',
  },
  'Internal: Insufficient Storage': {
    code: 507,
    message: 'Insufficient Storage',
  },
  'Internal: Loop Detected': { code: 508, message: 'Loop Detected' },
  'Internal: Bandwidth Limit Exceeded': {
    code: 509,
    message: 'Bandwidth Limit Exceeded',
  },
  'Internal: Not Extended': { code: 510, message: 'Not Extended' },
  'Internal: Network Authentication Required': {
    code: 511,
    message: 'Network Authentication Required',
  },
} as const
