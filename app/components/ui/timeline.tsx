"use client";

import {
  useMotionValueEvent,
  useScroll,
  useTransform,
  motion,
} from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

export const Timeline = ({ data }: { data: TimelineEntry[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div
      className="w-full bg-gradient-to-b from-black via-[#100a14] to-black font-sans md:px-10 flex flex-col items-center"
      ref={containerRef}
    >
      <div className="max-w-7xl mx-auto py-15 px-4 md:px-8 lg:px-10 text-center">
        <h2 className="text-2xl md:text-5xl mb-4 text-white max-w-5xl">
          RoadMap
        </h2>
        <p className="text-neutral-300 text-sm md:text-base max-w-sm mx-auto">
          Here&apos;s a detailed roadmap for this project.
        </p>
      </div>

      <div ref={ref} className="relative max-w-7xl mx-auto pb-20">
        {data.map((item, index) => {
          const itemRef = useRef<HTMLDivElement>(null);
          const [isBright, setIsBright] = useState(false);

          useEffect(() => {
            const observer = new IntersectionObserver(
              ([entry]) => {
                setIsBright(entry.isIntersecting);
              },
              { threshold: 0.5 }
            );

            if (itemRef.current) {
              observer.observe(itemRef.current);
            }

            return () => {
              if (itemRef.current) {
                observer.unobserve(itemRef.current);
              }
            };
          }, []);

          return (
            <div
              key={index}
              className={`flex justify-center pt-10 md:pt-40 md:gap-10`}
            >
              <div
                className={`sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full`}
              >
                <div className="h-10 absolute left-3 md:left-3 w-10 rounded-full bg-white dark:bg-black flex items-center justify-center">
                  <div
                    className={`h-4 w-4 rounded-full ${
                      isBright ? "bg-[#924ad8]" : "bg-gray-500"
                    } border border-neutral-300 dark:border-neutral-700 p-2`}
                  />
                </div>
                <motion.h3
                  className={`hidden md:block text-xl md:pl-20 md:text-5xl font-bold transition-all duration-300 ${
                    isBright ? "text-white" : "text-neutral-500 dark:text-neutral-500"
                  }`}
                  animate={{ opacity: isBright ? 1 : 0.5 }}
                  transition={{ duration: 1, ease: [0.42, 0, 0.58, 1] }}
                >
                  {item.title}
                </motion.h3>
              </div>

              <motion.div
                ref={itemRef}
                initial={{ opacity: 0.5 }}
                animate={{ opacity: isBright ? 1 : 0.5 }}
                transition={{ duration: 1, ease: [0.42, 0, 0.58, 1] }}
                className="relative pl-20 pr-4 md:pl-4 w-full"
              >
                <h3
                  className={`md:hidden block text-2xl mb-4 text-left font-bold transition-all duration-300 ${
                    isBright
                      ? "text-white"
                      : "text-neutral-500 dark:text-neutral-500"
                  }`}
                >
                  {item.title}
                </h3>
                <div
                  className={`${
                    isBright ? "text-white" : "text-neutral-500"
                  } text-lg transition-all duration-300`}
                >
                  {item.content}
                </div>
              </motion.div>
            </div>
          );
        })}
        <div
          style={{
            height: height + "px",
          }}
          className="absolute md:left-8 left-8 top-0 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-neutral-200 dark:via-neutral-700 to-transparent to-[99%] [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]"
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0  w-[2px] bg-gradient-to-t from-gray-500 via-gray-300 to-transparent from-[0%] via-[10%] rounded-full"
          />
        </div>
      </div>
    </div>
  );
};
