import DoubleImage from '@/components/animation/double-image'
import type { Dictionary } from '@/dictionaries/dictionaries'

export function Team({
  dictionary,
}: { dictionary: Dictionary['home']['team'] }) {
  return (
    <div className="flex w-full max-w-full flex-col items-center justify-start gap-4 sm:max-w-5xl md:flex-row md:items-start md:justify-center">
      {dictionary.people.map((person, i) => (
        <div
          className="flex w-full max-xs:flex-col gap-3 max-md:pl-4 md:flex-col"
          key={person.name}
        >
          <DoubleImage
            className="lg:!w-full aspect-square w-52 max-w-full rounded-4xl sm:max-w-80 md:w-60"
            imageClassName="dark:brightness-75"
            front={person.front}
            back={person.back}
            alt={person.name}
          />
          <div className="flex max-md:h-full w-64 flex-col max-md:justify-end gap-2 max-md:pt-3 max-sm:pb-4 max-sm:pl-2 sm:pt-6 md:gap-4 md:pt-0">
            <div className="pl-2">
              <h3 className="font-bold text-xl">{person.name}</h3>
              <p className="text-muted-foreground ">{person.role}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
