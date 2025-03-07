'use client'

import { useBreakpoint } from '@repo/ui/hooks/media-query'
import { motion } from 'motion/react'

const layers = [
  {
    id: 1,
  },
  {
    id: 2,
  },
  {
    id: 3,
  },
  {
    id: 4,
  },
  {
    id: 5,
  },
]

export function ImageGraphic() {
  const isAboveSm = useBreakpoint('sm', 'above')

  const layerTranslateX = 25
  const layerTranslateY = 15
  const baseTranslateX = 0 * layerTranslateX
  const baseTranslateY = -5 * layerTranslateY

  return (
    <div className="relative size-full max-sm:h-60 bg-gradient-to-b from-muted/60 via-muted-400/20 to-transparent">
      <div className="absolute top-1/2 left-1/2 size-0">
        {layers.map((layer, i) => (
          <motion.div
            key={layer.id}
            className="absolute z-10 size-24 rounded-xs bg-background shadow-md ring-2 ring-muted-foreground/30 "
            initial={{
              rotateY: 30,
              rotateX: 20,
              translateX: baseTranslateX - i * layerTranslateX,
              translateY: baseTranslateY + i * layerTranslateY,
            }}
            whileHover={{
              rotateY: 20,
              rotateX: 10,
              translateY: baseTranslateY + i * layerTranslateY - 20,
            }}
            transition={{
              type: 'spring',
              duration: 0.1,
              stiffness: 150,
              damping: 10,
            }}
          />
        ))}
      </div>

      {/* <motion.div
        className="absolute top-1/2 left-1/2 z-100 size-20 rounded-xs bg-background shadow-md ring-2 ring-muted-foreground/30 sm:size-24 "
        initial={{
          rotateY: 30,
          rotateX: 20,
          translateX: '-50%',
          translateY: '-50%',
        }}
        whileHover={{ rotateY: 20, rotateX: 10, translateY: -40 }}
        transition={{
          type: 'spring',
          duration: 0.1,
          stiffness: 150,
          damping: 10,
        }}
      />
      <motion.div
        className="absolute z-100 size-20 rounded-xs bg-background shadow-md ring-2 ring-muted-foreground/30 sm:size-24"
        initial={{ rotateY: 30, rotateX: 20, translateX: 40, translateY: -10 }}
        whileHover={{ rotateY: 20, rotateX: 10, translateY: -30 }}
        transition={{
          type: 'spring',
          duration: 0.1,
          stiffness: 150,
          damping: 10,
        }}
      />
      <motion.div
        className="absolute z-100 size-20 rounded-xs bg-background shadow-md ring-2 ring-muted-foreground/30 sm:size-24"
        initial={{ rotateY: 30, rotateX: 20, translateX: 10, translateY: 0 }}
        whileHover={{ rotateY: 20, rotateX: 10, translateY: -20 }}
        transition={{
          type: 'spring',
          duration: 0.1,
          stiffness: 150,
          damping: 10,
        }}
      />
      <motion.div
        className="absolute z-100 size-20 rounded-xs bg-background shadow-md ring-2 ring-muted-foreground/30 sm:size-24"
        initial={{ rotateY: 30, rotateX: 20, translateX: -20, translateY: 10 }}
        whileHover={{ rotateY: 20, rotateX: 10, translateY: -10 }}
        transition={{
          type: 'spring',
          duration: 0.1,
          stiffness: 150,
          damping: 10,
        }}
      />
      <motion.div
        className="absolute z-9 size-20 rounded-xs bg-background shadow-md ring-2 ring-muted-foreground/30 sm:size-24"
        initial={{ rotateY: 30, rotateX: 20, translateX: -50, translateY: 20 }}
        whileHover={{ rotateY: 20, rotateX: 10, translateY: 0 }}
        transition={{
          type: 'spring',
          duration: 0.1,
          stiffness: 200,
          damping: 10,
        }}
      /> */}
    </div>
  )
}
