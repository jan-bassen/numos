import {
  Body,
  Button,
  Column,
  Container,
  Font,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from '@react-email/components'
import { head } from 'lodash'
import * as React from 'react'

export type SupabaseEmailData = {
  token: string
  token_hash: string
  redirect_to: string
  email_action_type: 'signup' | 'login' | 'reset_password'
  site_url: string
  token_new: string
  token_hash_new: string
}

export type EmailProps = {
  user: {
    email: string
  }
  email_data: SupabaseEmailData
}

const previewText = 'Sign up to Numos Studio'
const content = {
  heading: 'Confirm your email',
  text: 'Please click the button below to confirm your email address and finish setting up your account.',
  button: 'Confirm',
  href: 'https://example.com',
}

export default function BaseEmail({ user, email_data }: EmailProps) {
  return (
    <Html>
      <Head>
        <Font
          fontFamily="Outfit"
          fallbackFontFamily="Verdana"
          webFont={{
            url: 'https://fonts.googleapis.com/css2?family=Outfit:wght@400&display=swap',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
        <Font
          fontFamily="Outfit"
          fallbackFontFamily="Verdana"
          webFont={{
            url: 'https://fonts.googleapis.com/css2?family=Outfit:wght@800&display=swap',
            format: 'woff2',
          }}
          fontWeight={800}
          fontStyle="extrabold"
        />
      </Head>
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white px-2 font-sans">
          <Container className="shadow-md mx-auto my-[50px] max-w-[480px] rounded-xl border border-zinc-200 border-solid px-[40px] pb-[48px] pt-[36px]">
            <Section className="">
              <Img
                src={
                  'https://ncqfkhposkxidjcaghvj.supabase.co/storage/v1/object/public/brand/email-banner.png'
                }
                width="105"
                height="42"
                alt="Numos"
                className=""
              />
            </Section>
            <Section className="mt-[20px] w-full pl-[14px]">
              <Heading className="m-0 p-0 font-extrabold text-[26px] text-black">
                {content.heading}
              </Heading>
              <Text className="m-0 mt-[8px] text-[14px] text-zinc-600 leading-[18px]">
                {content.text}
              </Text>
            </Section>
            <Section className="mt-[40px] w-full">
              <Button
                href={content.href}
                className="w-full cursor-pointer rounded-[8px] bg-black py-[10px] text-center text-white shadow-sm"
              >
                {content.button}
              </Button>
              {/* <Text className="w-full text-center text-[12px] m-0 mt-[6px] text-zinc-500">
                Anything not working? Let us know: team@numos.xyz
              </Text> */}
              {/* <Text className="w-full text-center text-[12px] m-0 mt-[6px] text-zinc-500">
                Not expecting this email?
              </Text> */}
              <Text className="w-full text-center text-[12px] m-0 mt-[8px] text-zinc-400">
                Contact{' '}
                <Link
                  href="mailto:team@numos.xyz"
                  className=" text-zinc-500"
                  style={{ textDecoration: 'underline' }}
                >
                  team@numos.xyz
                </Link>{' '}
                if any issues arise.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
