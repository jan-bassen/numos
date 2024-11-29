import { test } from '@jest/globals'
import { stringifyRequest } from '@repo/shared/security/requests/stringify-request'
import { signRequest } from '@repo/shared/security/requests/sign-request'
import { generateApiKey } from '@/authorizers/generate-api-key'
import { decrypt } from '@repo/shared/security/encryption/decrypt'
import { validateSignature } from '@repo/shared/security/validate-signature'
import type { RequestParams } from '@repo/shared/types/encryption'

const validRequest: RequestParams = {
  method: 'POST',
  content: {
    label: 'MockName',
    collection_id: '1e3116db-9cf2-4305-bc50-3ab5e8d14468',
  },
  contentType: 'application/json',
  uri: '/api/keys',
  nonce: '1234567890',
  timestamp: '1689876543',
}

const spoofedRequest: RequestParams = {
  method: 'POST',
  content: {
    label: 'MockName',
    collection_id: '1e3116db-9cf2-4305-bc50-3ab5e8d14468',
  },
  contentType: 'application/json',
  uri: '/api/keys',
  nonce: '1234567895',
  timestamp: '1689876018',
}

let requestString: string
let requestStringSpoofed: string

test('Stringifying the requests', async () => {
  requestString = stringifyRequest(validRequest)
  requestStringSpoofed = stringifyRequest(spoofedRequest)
  expect(typeof requestString).toBe('string')
  expect(typeof requestStringSpoofed).toBe('string')
})

let id: string
let clientSecret: string
let encryptedKey: string
let iv: string

test('Creating a new API key', async () => {
  const res = await generateApiKey()
  expect(typeof res.id).toBe('string')
  expect(typeof res.clientSecret).toBe('string')
  expect(typeof res.encryptedKey).toBe('string')
  expect(typeof res.iv).toBe('string')
  id = res.id
  clientSecret = res.clientSecret
  encryptedKey = res.encryptedKey
  iv = res.iv
})

let signature: string
let aesKey: string

test('Signing the request', async () => {
  const res = await signRequest(validRequest, clientSecret)
  expect(typeof res.signature).toBe('string')
  expect(typeof res.aesKey).toBe('string')
  signature = res.signature
  aesKey = res.aesKey
})

describe('Request is valid', () => {
  test('Verifying the request', async () => {
    const hmacKey = decrypt(aesKey, encryptedKey, iv)
    const valid = await validateSignature(hmacKey, requestString, signature)
    expect(valid).toBe(true)
  })
})

describe('Request is invalid', () => {
  test('Verifying the request', async () => {
    const hmacKey = decrypt(aesKey, encryptedKey, iv)
    const valid = await validateSignature(
      hmacKey,
      requestStringSpoofed,
      signature,
    )
    expect(valid).toBe(false)
  })
})

// TODO: Handle errors with decryption
describe('secret key is invalid', () => {
  test('Verifying the request', async () => {
    expect(() =>
      decrypt('fxkRe2_6UrwGUEUhh6uDKYxEIIflkz2QfbUohLr_zAq', encryptedKey, iv),
    ).toThrow()
  })
})
