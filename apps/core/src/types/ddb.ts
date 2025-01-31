export type ApiKeyEntry = {
  id: string
  active: boolean
  collection: string
  createdAt: string
  label: string
  encryptedKey: string
  iv: string
}

export type ApiKeyPublicEntry = {
  id: string
  active: boolean
  createdAt: string
  label: string
}
