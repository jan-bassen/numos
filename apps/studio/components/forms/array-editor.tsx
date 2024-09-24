import { Button } from '@repo/ui/components/ui/button'
import { Input } from '@repo/ui/components/ui/input'
import { PiAddAddStroke, PiMinusMinus } from '@/lib/icons'
import type { DataType } from '@/types/database.types'
import { useState } from 'react'

//TODO: Delete?

export default function ArrayEditor<T extends string | number>({
  locked,
  array,
  setArray,
  type,
}: {
  locked: boolean
  array: T[]
  setArray: (arg0: T[]) => void
  type: DataType
}) {
  const [value, setValue] = useState<T | undefined>(undefined)

  function add(emptyValue: T) {
    if (value === undefined || value === emptyValue || array.includes(value))
      return
    const newArray = array || []
    newArray.push(value)
    setArray(newArray)
    setValue(emptyValue)
  }

  function remove(index: number) {
    const newArray = array || []
    newArray.splice(index, 1)
    setArray(newArray)
  }

  return (
    <ul className="flex w-full flex-wrap gap-3">
      {array.map((item, index) => (
        <li key={crypto.randomUUID()} className="relative">
          <div className="flex h-10 min-w-[6rem] grow overflow-visible rounded-md border border-input bg-background px-3 py-2 md:text-sm">
            {item}
          </div>
          {!locked && (
            <Button
              type="button"
              onClick={() => remove(index)}
              variant={'outline'}
              className="-right-1.5 -top-1.5 absolute h-5 w-5 rounded-full p-0.5"
            >
              <PiMinusMinus className="h-4 w-4 stroke-muted-foreground" />
            </Button>
          )}
        </li>
      ))}
      {!locked && type === 'string' ? (
        <div className="flex w-full md:w-fit">
          <Input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value as T)}
            className="z-10 w-full min-w-[6rem] grow rounded-r-none border-r-0 md:w-fit"
          />
          <Button
            type="button"
            size={'md'}
            onClick={() => add('' as T)}
            variant={'outline'}
            className="rounded-l-none px-2"
          >
            <PiAddAddStroke
              strokeWidth={2}
              className="h-4 w-4 stroke-foreground"
            />
          </Button>
        </div>
      ) : type === 'number' ? (
        <div className="flex w-full md:w-fit">
          <Input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value as T)}
            className="z-10 w-full min-w-[6rem] grow rounded-r-none border-r-0 md:w-fit"
          />
          <Button
            type="button"
            onClick={() => add(0 as T)}
            variant={'outline'}
            className="rounded-l-none px-2"
          >
            <PiAddAddStroke
              strokeWidth={2}
              className="h-4 w-4 stroke-foreground"
            />
          </Button>
        </div>
      ) : null}
    </ul>
  )
}
