export type RequestParams = {
  method: 'POST' | 'GET' | 'PUT' | 'DELETE'
  content: any
  contentType: string
  uri: string
  nonce: string
  timestamp: string
}
