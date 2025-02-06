import DoubleImage from '@/components/animation/double-image'
import type { Dictionary } from '@/dictionaries/dictionaries'
import { PiLinkedinSolid, PiXComStroke } from '@repo/ui/icons/pika'
import Link from 'next/link'

export function Team({
  dictionary,
}: { dictionary: Dictionary['home']['team'] }) {
  return (
    <div className="flex w-full max-w-full flex-col items-center justify-start gap-4 sm:max-w-5xl md:flex-row md:items-start md:justify-center">
      {dictionary.people.map((person, i) => (
        <div
          className="flex w-full -xs:flex-col gap-3 -md:pl-4 md:flex-col"
          key={person.name}
        >
          <DoubleImage
            className="lg:!w-full aspect-square w-52 max-w-full rounded-home sm:max-w-80 md:w-60"
            imageClassName="dark:brightness-75"
            front={person.front}
            back={person.back}
            alt={person.name}
          />
          <div className="flex -md:h-full w-64 flex-col -md:justify-end gap-2 -md:pt-3 -sm:pb-4 -sm:pl-2 sm:pt-6 md:gap-4 md:pt-0">
            <div className="pl-2">
              <h3 className="font-bold text-xl">{person.name}</h3>
              <p className="text-muted-foreground ">{person.role}</p>
            </div>
            <div className="flex gap-2 pl-2">
              <Link
                target="_blank"
                href={`https://twitter.com/${person.twitter}`}
                className=" size-fit p-1 text-muted-foreground hover:text-foreground"
              >
                <PiXComStroke className="size-4" />
              </Link>
              {person.linkedin && (
                <Link
                  target="_blank"
                  href={`https://linkedin.com/in/${person.linkedin}`}
                  className=" size-fit p-1 text-muted-foreground hover:text-foreground"
                >
                  <PiLinkedinSolid className="size-4" />
                </Link>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
