'use client'

import { cn } from '@/lib/utils'
import { motion as m } from 'framer-motion'
import Image from 'next/image'
import { HTMLAttributes, useState } from 'react'

export default function DoubleImage({
  front,
  back,
  alt,
  className,
}: {
  front: string
  back: string
  alt: string
  className?: HTMLAttributes<HTMLDivElement>['className']
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
      <m.div
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
            'absolute inset-0 -scale-x-100 rounded-xl object-cover shadow-sm',
          )}
        />
        <Image
          src={front}
          alt={alt}
          width={1262}
          height={1262}
          className={cn(
            'absolute inset-0 rounded-xl object-cover shadow-sm transition-opacity delay-150 duration-0',
            rotated && 'opacity-0',
          )}
        />
      </m.div>
    </div>
  )
}
