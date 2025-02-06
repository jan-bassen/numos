import Image from 'next/image'

export function ModularGraphic() {
  return (
    <div className="relative size-full items-center justify-center bg-gradient-to-t from-muted/40 to-transparent">
      <div className="absolute z-10 size-full bg-gradient-to-t from-background/20 via-background/30 to-background" />
      <Image
        src="/assets/puzzle-piece.svg"
        alt="Puzzle piece"
        width={200}
        height={200}
        className="-translate-x-[calc(50%+30px)] -translate-y-5 absolute left-1/2 z-20 h-full object-cover transition-all duration-300 hover:scale-[1.03] dark:hidden"
      />
      <Image
        src="/assets/puzzle-piece-dark.svg"
        alt="Puzzle piece"
        width={200}
        height={200}
        className="-translate-x-[calc(50%+30px)] -translate-y-5 absolute left-1/2 z-20 hidden h-full object-cover transition-all duration-300 hover:scale-[1.03] dark:block"
      />
      <Image
        src="/assets/puzzle.svg"
        alt="Puzzle"
        width={800}
        height={400}
        className="absolute h-full object-cover dark:hidden"
      />
      <Image
        src="/assets/puzzle-dark.svg"
        alt="Puzzle"
        width={800}
        height={400}
        className="absolute hidden h-full object-cover dark:block"
      />

      {/* <div className="grid size-28 grid-cols-2 grid-rows-2 place-items-center opacity-10">
        <Image
          src="/assets/puzzle.svg"
          alt="Modular graphic"
          width={400}
          height={400}
          className="-rotate-[110deg] -translate-y-6 -translate-x-6 size-28 object-cover shadow-lg"
        />
        <Image
          src="/assets/puzzle.svg"
          alt="Modular graphic"
          width={400}
          height={400}
          className="size-28 object-cover shadow-lg"
        />
        <Image
          src="/assets/puzzle.svg"
          alt="Modular graphic"
          width={400}
          height={400}
          className="size-28 rotate-180 object-cover shadow-lg"
        />
        <Image
          src="/assets/puzzle.svg"
          alt="Modular graphic"
          width={400}
          height={400}
          className="size-28 rotate-90 object-cover shadow-lg"
        />
      </div> */}
    </div>
  )
}
