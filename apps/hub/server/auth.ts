import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { getDB } from '@/db'
import { username, anonymous, admin, multiSession } from 'better-auth/plugins'

export const auth = betterAuth({
  database: drizzleAdapter(getDB(), {
    provider: 'pg',
    usePlural: true,
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    twitter: {
      clientId: process.env.TWITTER_CLIENT_ID as string,
      clientSecret: process.env.TWITTER_CLIENT_SECRET as string,
    },
  },
  plugins: [username(), anonymous(), admin(), multiSession()],
})
