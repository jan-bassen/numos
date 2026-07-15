const LOCAL_STUDIO_URL = 'http://localhost:3000'
const PRODUCTION_STUDIO_URL = 'https://studio.bassen.dev'

function normalizeUrl(value: string) {
  const url = new URL(value)
  url.hash = ''
  url.pathname = '/'
  url.search = ''
  return url.toString()
}

export function getStudioUrl() {
  const configuredUrl = process.env.STUDIO_URL?.trim()

  if (configuredUrl) {
    return normalizeUrl(configuredUrl)
  }

  return process.env.NODE_ENV === 'production'
    ? PRODUCTION_STUDIO_URL
    : LOCAL_STUDIO_URL
}
