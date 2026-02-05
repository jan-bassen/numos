'use client'

import { PiKeyLeftStroke } from '@repo/ui/icons/pika'
import { DeleteKeyButton } from './delete-key-button'
import { CreateKeyButton } from './create-key-button'
import { useCollection } from '../collection-context'

const sampleData = [
  {
    id: '45cf5349-8e56-4bce-8a0a-b89ee84ad0d0',
    created: '2023-01-01T00:00:00.000Z',
    label: 'Website',
  },
  {
    id: '9df7aeb5-c761-4295-b9d3-f70b68083e4b',
    created: '2023-01-01T00:00:00.000Z',
    label: 'Backend',
  },
]

export default function ApiKeys() {
  const {
    collection: { settingsLocked },
  } = useCollection()
  return (
    <>
      <div className="divide-y divide-border md:max-w-[40rem]">
        {sampleData.map((item) => {
          const dateString = new Date(item.created).toLocaleDateString()
          return (
            <div
              key={item.id}
              className="flex min-h-12 items-center justify-between gap-2 p-2"
            >
              <div className="flex items-center gap-2">
                <PiKeyLeftStroke className="size-5 translate-y-px" />
                <div className="flex items-baseline gap-4">
                  <div className="text-ellipsis text-left">{item.label}</div>
                  <div className="-translate-y-px text-ellipsis text-left text-muted-foreground text-xs">
                    {dateString}
                  </div>
                </div>
              </div>
              {!settingsLocked && <DeleteKeyButton key={item.id} />}
            </div>
          )
        })}
      </div>
      {!settingsLocked && <CreateKeyButton />}
    </>
  )
}
