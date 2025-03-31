import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { username, anonymous, admin, multiSession } from 'better-auth/plugins'
import { sendEmail } from '@repo/email/send'
import { db } from '@/db/client'
import schema from '@/db/schema'
import { eq } from 'drizzle-orm'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    usePlural: true,
    schema,
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async (data, request) => {
      await sendEmail(data.user.email, 'resetPassword', {
        url: data.url,
      })
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async (data, request) => {
      await sendEmail(data.user.email, 'verify', {
        url: data.url,
      })
    },
  },
  socialProviders: {
    twitter: {
      clientId: process.env.TWITTER_CLIENT_ID as string,
      clientSecret: process.env.TWITTER_CLIENT_SECRET as string,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  plugins: [
    username({
      minUsernameLength: 3,
      maxUsernameLength: 30,
    }),
    anonymous({
      emailDomainName: 'guest.numos.xyz',
      onLinkAccount: async ({ anonymousUser, newUser }) => {
        await db
          .update(schema.wallets)
          .set({
            userId: newUser.user.id,
          })
          .where(eq(schema.wallets.userId, anonymousUser.user.id))
      },
    }),
    admin({
      adminRoles: ['admin', 'team'],
    }),
    multiSession(),
  ],
})
