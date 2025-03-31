import {
  Body,
  Button,
  Container,
  Font,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components'
import type * as React from 'react'

type EmailBaseProps = {
  previewText: string
  heading: string
  description: string
  children: React.ReactNode
}

export default function BaseEmail({
  previewText,
  heading,
  description,
  children,
}: EmailBaseProps) {
  return (
    <Html>
      <Tailwind>
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
            fontFamily="Poppins"
            fallbackFontFamily="Verdana"
            webFont={{
              url: 'https://fonts.googleapis.com/css2?family=Poppins:wght@800&display=swap',
              format: 'woff2',
            }}
            fontWeight={800}
            fontStyle="extrabold"
          />
        </Head>
        <Preview>{previewText}</Preview>
        <Body className="mx-auto my-auto bg-white px-2 font-sans">
          <Container className="mx-auto my-[50px] max-w-[480px] rounded-xl border-zinc-200 border-solid px-[40px] pt-[36px] pb-[48px] md:border md:shadow-md">
            <Section className="">
              <Img
                src={
                  'https://ncqfkhposkxidjcaghvj.supabase.co/storage/v1/object/public/brand/logo_black.png'
                }
                width="80"
                alt="Numos"
                className="pl-2"
              />
            </Section>
            <Section className="mt-8 w-full pl-2">
              <Heading className="m-0 p-0 font-extrabold text-[26px] text-black">
                {heading}
              </Heading>
              <Text className="m-0 mt-2 text-[14px] text-zinc-600 leading-[18px]">
                {description}
              </Text>
            </Section>
            <Section className="mt-10 w-full">
              {children}
              <Text className="m-0 mt-4 w-full text-center text-[12px] text-zinc-400">
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
