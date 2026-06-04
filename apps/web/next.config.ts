import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { NextConfig } from 'next'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const nextConfig: NextConfig = {
  // Self-hosted on Coolify (Docker). Standalone output bundles a minimal
  // server + traced deps so the runtime image stays small.
  output: 'standalone',
  // We import @repo/ui straight from its .tsx source, so Next must transpile it.
  transpilePackages: ['@repo/ui'],
  // Trace files from the monorepo root so workspace deps are included.
  outputFileTracingRoot: path.join(__dirname, '../../'),
}

export default nextConfig
