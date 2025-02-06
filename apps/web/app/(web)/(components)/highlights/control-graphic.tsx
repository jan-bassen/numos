import Image from 'next/image'

export function ControlGraphic() {
  return (
    <div className="relative size-full items-center justify-center bg-gradient-to-b from-background/40 to-transparent md:bg-gradient-to-t">
      <div className="absolute z-20 size-full bg-gradient-radial from-transparent via-70% via-background/70 to-background md:via-60% md:via-transparent" />
      <Image
        src="/assets/control-key.svg"
        alt="Modular graphic"
        width={400}
        height={400}
        className="-translate-x-1/2 absolute top-[10px] left-1/2 z-30 size-28 rotate-[25deg] object-cover dark:hidden"
      />
      <Image
        src="/assets/control-key-dark.svg"
        alt="Modular graphic"
        width={400}
        height={400}
        className="-translate-x-1/2 absolute top-[10px] left-1/2 z-30 hidden size-28 rotate-[25deg] object-cover dark:block"
      />
      <div className="absolute z-20 size-full bg-gradient-to-b from-background/10 via-80% via-background/70 to-background" />
      <Image
        src="/assets/control.svg"
        alt="Control"
        width={800}
        height={400}
        className="absolute z-10 object-cover dark:hidden"
      />
      <Image
        src="/assets/control-dark.svg"
        alt="Control"
        width={800}
        height={400}
        className="absolute z-10 hidden h-full object-cover dark:block"
      />
      <div className="absolute size-full bg-muted/80" />
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
