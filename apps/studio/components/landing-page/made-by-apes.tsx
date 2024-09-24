import Headline from '@/components/landing-page/headline'
import DoubleImage from './double-image'
import { PiLinkedinSolid, PiXComStroke } from '@/lib/icons'
import Link from 'next/link'

const people = [
  {
    name: 'Jan Bassen',
    role: 'Tech & Design',
    front: '/images/people/5341.png',
    back: '/images/people/jan.jpeg',
    twitter: '_bassen_',
  },
  {
    name: 'Colin Lieb',
    role: 'Operations & PR',
    front: '/images/people/3134.png',
    back: '/images/people/colin.jpg',
    twitter: 'colinlieb',
    linkedin: 'colinlieb',
  },
  {
    name: 'Michael Dücker',
    role: 'Customers & Sales',
    front: '/images/people/25702.png',
    back: '/images/people/michael.png',
    twitter: '0xMaloha',
    linkedin: 'michaelduecker',
  },
]

export default function MadeByApes() {
  return (
    <div className="flex flex-col pb-8">
      <Headline
        title="Made by Apes with love"
        description="We've been web3 enthusiasts from the start, now we are building the tool we wish we had ourselves"
      />
      <div className="flex w-full flex-col items-center justify-start gap-12 md:flex-row md:items-start md:justify-center">
        {people.map((person, i) => (
          <div className="flex flex-col gap-3" key={person.name}>
            <DoubleImage
              className="size-56 max-w-full sm:size-72 md:size-60 lg:size-64"
              front={person.front}
              back={person.back}
              alt={person.name}
            />
            <div className="pl-2">
              <h3 className="text-xl font-bold">{person.name}</h3>
              <p className="text-muted-foreground ">{person.role}</p>
            </div>
            <div className="flex gap-2 pl-2">
              <Link
                target="_blank"
                href={`https://twitter.com/${person.twitter}`}
                className=" size-fit p-1 text-muted-foreground"
              >
                <PiXComStroke className="size-4" />
              </Link>
              {person.linkedin && (
                <Link
                  target="_blank"
                  href={`https://linkedin.com/in/${person.linkedin}`}
                  className=" size-fit p-1 text-muted-foreground"
                >
                  <PiLinkedinSolid className="size-4" />
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
