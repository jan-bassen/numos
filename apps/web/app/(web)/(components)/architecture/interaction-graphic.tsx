'use client'

import type { Dictionary } from '@/dictionaries/dictionaries'
import {
  PiAutomationStroke,
  PiMedicinePillCapsuleStroke,
  PiNftArrowRightSolid,
  PiPhotoImageCheckStroke,
} from '@repo/ui/icons/pika'
import { cn } from '@repo/ui/lib/utils'
import { motion } from 'motion/react'

export function InteractionGraphic({
  dictionary,
}: {
  dictionary: Dictionary['home']['architecture']['action']['graphic']
}) {
  return (
    <div className="relative h-60 max-h-full bg-gradient-radial from-muted/65 to-transparent">
      <div className="pointer-events-none absolute z-20 size-full bg-gradient-to-b from-background/15 via-60% via-background/40 to-background" />
      <div className="-translate-x-1/2 -translate-y-1/2 !h-44 absolute top-1/2 left-1/2 flex flex-col items-center justify-center">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className={cn(
            'z-30 w-56 rounded-lg bg-background p-3 shadow-md ring-2 ring-muted-foreground/30',
          )}
        >
          <div className="flex items-center gap-3">
            <div className="aspect-square size-6 rounded-xs bg-muted p-1 ring-2 ring-muted-foreground/50">
              <PiNftArrowRightSolid className="size-4 text-muted-foreground" />
            </div>
            <p className="font-medium text-sm">{dictionary.trigger}</p>
            <div className="ml-auto ">
              <div className="size-2 rounded-full bg-creative outline outline-2 outline-creative/20 outline-offset-1" />
            </div>
          </div>
        </motion.div>
        <div className="grid w-56 grid-cols-6 ">
          {/* vertical line */}
          <div className="col-span-1 row-span-1 row-start-1 flex items-end justify-end pr-3">
            <div className="h-full w-0.5 bg-border" />
          </div>
          <div className="col-span-1 row-span-1 row-start-2 flex items-start justify-end">
            <div className="h-full w-0.5 bg-border" />
            <div className="h-0.5 w-3 bg-border" />
          </div>
          <div className="col-span-1 row-span-1 row-start-3 flex items-start justify-end">
            <div className="h-full w-0.5 bg-border" />
            <div className="h-0.5 w-3 bg-border" />
          </div>
          <div className="col-span-1 row-span-1 row-start-4 flex items-start justify-end">
            <div className="h-full w-0.5 bg-border" />
            <div className="h-0.5 w-3 bg-border" />
          </div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className={cn(
              'col-span-5 col-start-2',
              ' !translate-y-1/2 z-100 w-full rounded-full bg-background px-3 py-1 shadow-md ring-2 ring-muted-foreground/30',
            )}
          >
            <div className="flex items-center gap-3">
              <PiMedicinePillCapsuleStroke className="size-4 text-muted-foreground" />
              <p className="font-medium text-sm">{dictionary.effects[0]}</p>
            </div>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className={cn(
              'col-span-5 col-start-2',
              ' !translate-y-1/2 z-100 mt-2 w-full rounded-full bg-background px-3 py-1 shadow-md ring-2 ring-muted-foreground/30',
            )}
          >
            <div className="flex items-center gap-3">
              <PiAutomationStroke className="size-4 text-muted-foreground" />
              <p className="font-medium text-sm">{dictionary.effects[1]}</p>
            </div>
          </motion.div>
          <motion.div
            whileHover={{ translateY: -50 }}
            className={cn(
              'col-span-5 col-start-2',
              ' !translate-y-1/2 z-100 mt-2 w-full rounded-full bg-background px-3 py-1 shadow-md ring-2 ring-muted-foreground/30',
            )}
          >
            <div className="flex items-center gap-3">
              <PiPhotoImageCheckStroke className="size-4 text-muted-foreground" />
              <p className="font-medium text-sm">{dictionary.effects[2]}</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
