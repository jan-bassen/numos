import { Button } from '@react-email/components'
import BaseEmail from '../base'

export type VerifyEmailProps = {
  url: string
}

export default function VerifyEmail({ url }: VerifyEmailProps) {
  return (
    <BaseEmail
      previewText="Verify your email"
      heading="Verify your email"
      description="Please click the button below to verify your email address and finish setting up your account."
    >
      <Button
        href={url}
        className="w-full cursor-pointer rounded-[8px] bg-black py-[10px] text-center text-white shadow-xs"
      >
        Verify email
      </Button>
    </BaseEmail>
  )
}
