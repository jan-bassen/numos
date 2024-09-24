'use client'

import {
  PiDoubleChevronRightStroke,
  PiMedicalCrossStroke,
  PiPointerCursorClickStroke,
  PiScaleStroke,
  PiTrendlineUpStroke,
} from '@/lib/icons'
import { motion as m, useScroll, useTransform } from 'framer-motion'
import { Droplets, Pipette } from 'lucide-react'
import { useRef } from 'react'

type Position = {
  x: number
  y: number
}

function classicConnectionPath(
  points: [Position, Position],
  curvature: number,
) {
  const [{ x: x1, y: y1 }, { x: x2, y: y2 }] = points
  const vertical = Math.abs(y1 - y2)
  const hx1 = x1 + Math.max(vertical / 2, Math.abs(x2 - x1)) * curvature
  const hx2 = x2 - Math.max(vertical / 2, Math.abs(x2 - x1)) * curvature

  return `M ${x1} ${y1} C ${hx1} ${y1} ${hx2} ${y2} ${x2} ${y2}`
}

export default function EditorGraphic() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollY, scrollYProgress } = useScroll({ target: ref })

  const nodeOneX = useTransform(() => -55 + scrollYProgress.get() * -20)
  const nodeOneY = useTransform(() => -30 + scrollYProgress.get() * -15)

  const nodeTwoX = useTransform(() => -75 + scrollYProgress.get() * -20)
  const nodeTwoY = useTransform(() => 35 + scrollYProgress.get() * 15)

  const nodeThreeX = useTransform(() => 130 + scrollYProgress.get() * 10)

  const pathOneStrokeWidth = useTransform(() => 4 - scrollYProgress.get() * 1.5)
  const pathOneScaleX = useTransform(() => 0.9 + scrollYProgress.get() / 2)
  const pathOneScaleY = useTransform(() => 0.5 + scrollYProgress.get() / 3)
  const pathOneTranslateY = useTransform(() => -23 - scrollYProgress.get() * 8)

  const pathTwoStrokeWidth = useTransform(() => 4 - scrollYProgress.get() * 2)
  const pathTwoScaleX = useTransform(() => 0.85 + scrollYProgress.get() / 2)
  const pathTwoScaleY = useTransform(() => 0.55 + scrollYProgress.get() / 2)
  const pathTwoTranslateY = useTransform(() => 30 + scrollYProgress.get() * 12)

  const pathOpacity = useTransform(() => 1 - scrollYProgress.get() * 0.5)

  const pathOne = classicConnectionPath(
    [
      { x: 0, y: 0 },
      { x: 64, y: 32 },
    ],
    0.55,
  )

  const pathTwo = classicConnectionPath(
    [
      { x: 0, y: 32 },
      { x: 64, y: 0 },
    ],
    0.55,
  )

  return (
    <div
      ref={ref}
      className="-mb-12 md:-mb-16 h-96 w-full overflow-hidden sm:overflow-visible lg:mb-auto"
    >
      <div className="-translate-x-5 grid size-full place-items-center md:translate-x-0">
        <m.div
          style={{ translateX: nodeOneX, translateY: nodeOneY }}
          className="z-20 col-span-1 col-start-1 row-span-1 row-start-1 flex items-center justify-between rounded-lg border border-border bg-muted py-2 pr-2 pl-4 text-sm"
        >
          <div className="flex items-center gap-2">
            <Pipette className="h-4 w-4" />
            <p className="">Fertilize</p>
          </div>
          <div className="z-20 box-border inline-block size-4 translate-x-4 rounded-full border-2 border-border bg-grid align-middle" />
        </m.div>
        <m.div
          style={{ translateX: nodeTwoX, translateY: nodeTwoY }}
          className="z-20 col-span-1 col-start-1 row-span-1 row-start-1 flex items-center justify-between rounded-lg border border-border bg-muted py-2 pr-2 pl-4 text-sm"
        >
          <div className="flex items-center gap-2">
            <PiMedicalCrossStroke className="h-4 w-4" />
            <p className="">Increase Health</p>
          </div>
          <div className="z-20 box-border inline-block size-4 translate-x-4 rounded-full border-2 border-border bg-grid align-middle" />
        </m.div>
        <m.div
          style={{ translateX: nodeThreeX, translateY: 0 }}
          className="z-20 col-span-1 col-start-1 row-span-1 row-start-1 flex min-w-28 flex-col gap-3 rounded-lg border border-border bg-muted pt-4 pr-4 pb-3 pl-2 text-sm"
        >
          {/* <h3 className=" font-bold pl-2 pb-1">Action</h3> */}
          <div className="justify-left -translate-x-1 flex w-full">
            <div className="-translate-x-3 z-20 box-border inline-block size-4 rounded-full border-2 border-border bg-grid align-middle" />
            <div className="">
              <p className="">Action</p>
            </div>
          </div>
          <div className="justify-left -translate-x-1 flex w-full">
            <div className="-translate-x-3 z-20 box-border inline-block size-4 rounded-full border-2 border-border bg-grid align-middle" />
            <div className="">
              {/* <PiMedicalCrossStroke className="w-4 h-4" /> */}
              <p className="">Effect</p>
            </div>
          </div>
        </m.div>
        <m.svg
          style={{
            scaleX: pathOneScaleX,
            scaleY: pathOneScaleY,
            translateX: 38,
            translateY: pathOneTranslateY,
            strokeWidth: pathOneStrokeWidth,
            opacity: pathOpacity,
          }}
          xmlns="http://www.w3.org/2000/svg"
          className="!overflow-visible pointer-events-none z-60 col-span-1 col-start-1 row-span-1 row-start-1 size-fit h-8 w-16"
        >
          <title>path</title>
          <path
            fill="none"
            className="pointer-events-auto stroke-border"
            d={pathOne}
          />
        </m.svg>
        <m.svg
          style={{
            scaleX: pathTwoScaleX,
            scaleY: pathTwoScaleY,
            translateX: 55,
            translateY: pathTwoTranslateY,
            strokeWidth: pathTwoStrokeWidth,
            opacity: pathOpacity,
          }}
          xmlns="http://www.w3.org/2000/svg"
          className="!overflow-visible pointer-events-none z-60 col-span-1 col-start-1 row-span-1 row-start-1 size-fit h-12 w-24"
        >
          <title>path</title>
          <path
            fill="none"
            className="pointer-events-auto stroke-border"
            d={pathTwo}
          />
        </m.svg>
        <div className="z-0 col-span-1 col-start-1 row-span-1 row-start-1 grid h-96 w-full translate-x-10 place-items-center bg-[40px_40px] bg-[length:80px_80px] bg-dots_grid opacity-25 [mask-image:radial-gradient(circle_at_center,black,transparent_80%)] dark:opacity-50" />
      </div>
    </div>
  )
}
