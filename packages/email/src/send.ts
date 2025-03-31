import { render } from '@react-email/components'
import VerifyEmail, { type VerifyEmailProps } from '@repo/email/emails/verify'
import { SES, type SendEmailCommandInput } from '@aws-sdk/client-ses'
import { isArray } from 'lodash'
import { tryCatchAsync } from '@repo/shared/result/try'
import { Ok } from '@repo/shared/result/ok'
import ResetPasswordEmail, {
  type ResetPasswordEmailProps,
} from '@repo/email/emails/reset-password'

const accessKeyId = process.env.AWS_ACCESS_KEY_ID
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY

if (!accessKeyId || !secretAccessKey) {
  throw new Error('AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY must be set')
}

export const ses = new SES({
  region: process.env.AWS_SES_REGION,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
})

const emails = {
  verify: {
    html: VerifyEmail,
    subject: 'Verify your email',
    from: 'auth@numos.xyz',
  },
  resetPassword: {
    html: ResetPasswordEmail,
    subject: 'Reset your password',
    from: 'auth@numos.xyz',
  },
}

export type EmailProps = {
  verify: VerifyEmailProps
  resetPassword: ResetPasswordEmailProps
}

export type EmailType = keyof typeof emails

export const sendEmail = async <T extends EmailType>(
  to: string,
  type: T,
  props: EmailProps[T],
) => {
  const res = tryCatchAsync(async () => {
    const email = emails[type]
    const html = await render(email.html(props))
    const ToAddresses = isArray(to) ? to : [to]

    const command: SendEmailCommandInput = {
      Source: email.from,
      Destination: {
        ToAddresses,
      },
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: html,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: email.subject,
        },
      },
    }

    const result = await ses.sendEmail(command)

    return new Ok(result)
  })

  return res
}
