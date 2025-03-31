import { Button } from '@react-email/components'
import BaseEmail from '../base'

export type ResetPasswordEmailProps = {
  url: string
}

export default function ResetPasswordEmail({ url }: ResetPasswordEmailProps) {
  return (
    <BaseEmail
      previewText="Reset your password"
      heading="Reset your password"
      description="Please click the button below to reset your password."
    >
      <Button
        href={url}
        className="w-full cursor-pointer rounded-[8px] bg-black py-[10px] text-center text-white shadow-xs"
      >
        Reset password
      </Button>
    </BaseEmail>
  )
}
