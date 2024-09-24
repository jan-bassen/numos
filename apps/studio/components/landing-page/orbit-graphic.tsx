"use client";

import {
  PiAwardMedalStroke,
  PiBook,
  PiColorPaletteStroke,
  PiGamingPadStroke,
  PiIphoneStroke,
  PiMonitor02Stroke,
  PiNftDefaultSolid,
  PiTicketTokenOneStroke,
  PiVisionProStroke,
} from "@/lib/icons";
import {
  MotionValue,
  motion as m,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { ReactNode, useRef } from "react";

type Direction = number | "auto";

type ScrollDivProps = {
  children: ReactNode;
  rotation: MotionValue<number>;
  left?: Direction;
  right?: Direction;
  top?: Direction;
  bottom?: Direction;
};

function ScrollDiv({
  children,
  rotation,
  left = "auto",
  right = "auto",
  top = "auto",
  bottom = "auto",
}: ScrollDivProps) {
  return (
    <m.div
      style={{
        rotate: rotation,
        left: left,
        right: right,
        top: top,
        bottom: bottom,
      }}
      className="absolute z-10 size-8 rounded-md bg-background p-1 text-muted-foreground"
    >
      {children}
    </m.div>
  );
}

export default function OrbitGraphic() {
  const ref = useRef(null);
  const { scrollY } = useScroll({ target: ref });

  const outerScroll = useTransform(() => scrollY.get() / 30);
  const reversedOuterScroll = useTransform(() => scrollY.get() / -30);
  const outerRotation = useSpring(outerScroll, { stiffness: 90, damping: 40 });
  const reversedOuterRotation = useSpring(reversedOuterScroll, {
    stiffness: 90,
    damping: 40,
  });

  const middleScroll = useTransform(() => scrollY.get() / 40);
  const reversedMiddleScroll = useTransform(() => scrollY.get() / -40);
  const middleRotation = useSpring(middleScroll, {
    stiffness: 90,
    damping: 40,
  });
  const reversedMiddleRotation = useSpring(reversedMiddleScroll, {
    stiffness: 90,
    damping: 40,
  });

  return (
    <div className="relative -mb-12 h-80 w-full scale-75 sm:scale-90 md:mb-auto md:h-96 md:scale-100">
      <div
        className="absolute left-1/2 top-1/2 size-80 -translate-x-1/2 -translate-y-1/2"
        ref={ref}
      >
        <m.div
          style={{
            rotate: outerRotation,
            position: "absolute",
          }}
          className="absolute size-80 rounded-full border border-border"
        >
          <ScrollDiv rotation={reversedOuterRotation} top={24} right={34}>
            <PiGamingPadStroke />
          </ScrollDiv>
          <ScrollDiv rotation={reversedOuterRotation} left={48} bottom={16}>
            <PiVisionProStroke />
          </ScrollDiv>
          <ScrollDiv rotation={reversedOuterRotation} left={56} top={12}>
            <PiIphoneStroke />
          </ScrollDiv>
          <ScrollDiv rotation={reversedOuterRotation} right={-4} bottom={80}>
            <PiMonitor02Stroke />
          </ScrollDiv>
        </m.div>
        <m.div
          style={{
            rotate: middleRotation,
            left: "50%",
            top: "50%",
            translateX: "-120px",
            translateY: "-120px",
          }}
          className="absolute size-60 rounded-full border border-border"
        >
          <ScrollDiv rotation={reversedMiddleRotation} left={0} top={48}>
            <PiColorPaletteStroke />
          </ScrollDiv>
          <ScrollDiv rotation={reversedMiddleRotation} right={64} top={-4}>
            <PiTicketTokenOneStroke />
          </ScrollDiv>
          <ScrollDiv rotation={reversedMiddleRotation} right={56} bottom={-4}>
            <PiAwardMedalStroke />
          </ScrollDiv>
        </m.div>
        <m.div
          style={{
            rotate: outerRotation,
            left: "50%",
            top: "50%",
            translateX: "-80px",
            translateY: "-80px",
          }}
          className="absolute size-40 rounded-full border border-border"
        >
          <ScrollDiv rotation={reversedOuterRotation} right={40} bottom={-10}>
            <PiBook />
          </ScrollDiv>
          {/* <PiCryptoCurrencyEthereumStroke className="bg-background z-10 stroke-none text-muted-foreground rounded-md p-1  size-7 absolute -right-2 top-10" /> */}
        </m.div>
        <PiNftDefaultSolid className="relative left-1/2 top-1/2 size-12 -translate-x-6 -translate-y-6" />
      </div>
    </div>
  );
}
