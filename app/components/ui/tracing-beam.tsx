"use client";
import React, { useEffect, useRef } from "react";
import { motion, useTransform, useScroll, useSpring } from "framer-motion";

export const TracingBeam = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const springConfig = { stiffness: 100, damping: 30, bounce: 0 };
  const x = useSpring(
    useTransform(scrollYProgress, [0, 0.5, 1], [0, 500, 1000]),
    springConfig
  );
  const y = useSpring(
    useTransform(scrollYProgress, [0, 0.5, 1], [0, 500, 1000]),
    springConfig
  );

  return (
    <div
      ref={ref}
      className="relative antialiased"
    >
      <motion.div
        className="absolute left-0 top-3 w-[2px] h-full bg-gradient-to-b from-[#924ad8] to-transparent"
        style={{
          scaleY: scrollYProgress,
        }}
      />
      {children}
    </div>
  );
};
