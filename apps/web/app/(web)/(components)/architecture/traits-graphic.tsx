'use client'

import {
  PiCalendarDefaultStroke,
  PiMapPin02AreaStroke,
  PiMedicalCrossStroke,
  PiMedicinePillCapsuleStroke,
  PiTagStroke,
} from '@repo/ui/icons/pika'
import { motion } from 'motion/react'

export function TraitsGraphic() {
  return (
    <div className="relative h-60 bg-gradient-to-b from-transparent via-muted/50 to-transparent">
      <div className="pointer-events-none absolute z-10 size-full bg-gradient-to-b from-background via-background/25 to-background" />
      <div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 flex size-full flex-col items-center justify-center gap-2.5 px-6">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex w-10/12 justify-between rounded-full bg-background py-1 pr-3 pl-2 text-sm shadow-sm ring-2 ring-muted-foreground/30"
        >
          <div className="flex items-center gap-1.5">
            <PiMedicalCrossStroke className="size-4 text-muted-foreground" />
            <p className="text-muted-foreground">Alive</p>
          </div>
          <p className="xs:hidden font-medium">Yes</p>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex w-11/12 justify-between rounded-full bg-background py-1 pr-3 pl-2 text-sm shadow-md ring-2 ring-muted-foreground/30"
        >
          <div className="flex items-center gap-1.5">
            <PiTagStroke className="size-4 text-muted-foreground" />
            <p className="text-muted-foreground">Name</p>
          </div>
          <p className=" font-semibold">Curtis</p>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex w-full justify-between rounded-full bg-background py-1 pr-3 pl-2 text-sm shadow-lg ring-2 ring-muted-foreground/30"
        >
          <div className="flex items-center gap-1.5">
            <PiMedicinePillCapsuleStroke className="size-4 text-muted-foreground" />
            <p className="text-muted-foreground">Health</p>
          </div>
          <p className="font-medium">97%</p>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex w-11/12 justify-between rounded-full bg-background py-1 pr-3 pl-2 text-sm shadow-md ring-2 ring-muted-foreground/30"
        >
          <div className="flex items-center gap-1.5">
            <PiMapPin02AreaStroke className="size-4 text-muted-foreground" />
            <p className="text-muted-foreground">Location</p>
          </div>
          <p className="font-medium">
            Miami <span className="-2xs:hidden">, FL</span>
          </p>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex w-10/12 justify-between rounded-full bg-background py-1 pr-3 pl-2 text-sm shadow-sm ring-2 ring-muted-foreground/30"
        >
          <div className="flex items-center gap-1.5">
            <PiCalendarDefaultStroke className="size-4 text-muted-foreground" />
            <p className="text-muted-foreground">Last Transfer</p>
          </div>
          <p className="-xs:hidden font-medium">2024-01-01</p>
        </motion.div>
      </div>
    </div>
  )
}
