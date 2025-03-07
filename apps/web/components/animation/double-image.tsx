'use client'

import { cn } from '@repo/ui/lib/utils'
import { motion } from 'motion/react'
import Image from 'next/image'
import { type HTMLAttributes, useState } from 'react'

export default function DoubleImage({
  front,
  back,
  alt,
  className,
  imageClassName,
}: {
  front: string
  back: string
  alt: string
  className?: HTMLAttributes<HTMLDivElement>['className']
  imageClassName?: HTMLAttributes<HTMLImageElement>['className']
}) {
  const [rotated, setRotated] = useState(false)
  const variants = {
    front: {
      rotateY: 0,
    },
    back: {
      rotateY: 180,
    },
  }
  return (
    <div
      onFocus={() => setRotated(true)}
      onBlur={() => setRotated(false)}
      onMouseOver={() => setRotated(true)}
      onMouseOut={() => setRotated(false)}
      onTouchStart={() => {
        setRotated(!rotated)
      }}
      className={`${className} relative`}
    >
      <motion.div
        variants={variants}
        initial={{ rotateY: 0 }}
        animate={rotated ? 'back' : 'front'}
        transition={{ type: 'spring', damping: 12, stiffness: 100 }}
      >
        <Image
          src={back}
          alt={alt}
          width={1262}
          height={1262}
          className={cn(
            '-scale-x-100 absolute inset-0 rounded-4xl border-2 border-border object-cover shadow-xs',
            imageClassName,
          )}
        />
        <Image
          src={front}
          alt={alt}
          width={1262}
          height={1262}
          className={cn(
            'absolute inset-0 rounded-4xl border-2 border-border object-cover shadow-xs transition-opacity delay-150 duration-0',
            imageClassName,
            rotated && 'opacity-0',
          )}
        />
      </motion.div>
    </div>
  )
}
